// Filename: data.setup.ts
// Seeds the data that @needs-data tests read: one Registry and one completed ScanJob.
// Runs after login (global.setup.ts) and before the "chromium-data" project.
//
// Data is created through Rancher's Kubernetes API (Steve) with the saved login session, not through the
// UI - the Create form and Start scan button are covered by @functional tests. Safe to rerun: an existing
// registry or completed scan is reused. Set SEED_DATA=false to skip it and use the cluster's own data.
import { test as setup, expect, APIRequestContext } from '@playwright/test';

// A user namespace: Rancher's default "Only User Namespaces" filter hides system ones like cattle-*.
const NAMESPACE = process.env.SEED_NAMESPACE || 'default';
const REGISTRY = 'e2e-seed';
const REGISTRIES_API = '/v1/sbomscanner.kubewarden.io.registries';
const SCANJOBS_API = '/v1/sbomscanner.kubewarden.io.scanjobs';
const SCAN_TIMEOUT = 15 * 60_000;

// Same public images SBOMScanner's own e2e tests scan (old golang:1.12-alpine, so they have CVEs).
// linux/amd64 only, to keep the scan short.
const registrySpec = {
  catalogType:  'OCIDistribution',
  uri:          'ghcr.io',
  repositories: [{ name: 'kubewarden/sbomscanner/test-assets/golang' }],
  platforms:    [{ os: 'linux', arch: 'amd64' }],
};

type Condition = { type: string; status: string; reason?: string; message?: string };
type ScanJob = { metadata: { name: string }; spec: { registry: string }; status?: { conditions?: Condition[] } };

const hasCondition = (job: ScanJob, type: string) => !!job.status?.conditions?.some((c) => c.type === type && c.status === 'True');

// Steve rejects writes without the CSRF cookie echoed back in a header.
async function csrfHeader(request: APIRequestContext) {
  const { cookies } = await request.storageState();
  const csrf = cookies.find((c) => c.name === 'CSRF')?.value;

  if (!csrf) {
    throw new Error('No CSRF cookie in the saved login session - did global.setup.ts run?');
  }

  return { 'X-Api-Csrf': csrf };
}

async function expectOk(response: Awaited<ReturnType<APIRequestContext['get']>>, action: string) {
  if (!response.ok()) {
    throw new Error(`${ action } failed: ${ response.status() } ${ await response.text() }`);
  }
}

setup('Seed registry and scan data', async ({ request }) => {
  setup.skip(process.env.SEED_DATA === 'false', 'SEED_DATA=false - using the cluster\'s existing data');
  setup.setTimeout(SCAN_TIMEOUT + 60_000);

  const headers = await csrfHeader(request);

  await setup.step(`registry ${ NAMESPACE }/${ REGISTRY } exists`, async () => {
    const existing = await request.get(`${ REGISTRIES_API }/${ NAMESPACE }/${ REGISTRY }`);

    if (existing.ok()) {
      console.log(`✓ Registry ${ REGISTRY } already exists`);

      return;
    }

    const created = await request.post(REGISTRIES_API, {
      headers,
      data: {
        type:       'sbomscanner.kubewarden.io.registry',
        apiVersion: 'sbomscanner.kubewarden.io/v1alpha1',
        kind:       'Registry',
        metadata:   { name: REGISTRY, namespace: NAMESPACE },
        spec:       registrySpec,
      },
    });

    await expectOk(created, `Creating registry ${ REGISTRY }`);
    console.log(`✓ Created registry ${ REGISTRY }`);
  });

  const scanJobName = await setup.step('a scan of the registry is running or complete', async () => {
    const list = await request.get(`${ SCANJOBS_API }/${ NAMESPACE }`);

    await expectOk(list, 'Listing scan jobs');
    const jobs: ScanJob[] = ((await list.json()).data || []).filter((j: ScanJob) => j.spec?.registry === REGISTRY);
    const reusable = jobs.find((j) => hasCondition(j, 'Complete')) || jobs.find((j) => !hasCondition(j, 'Failed'));

    if (reusable) {
      console.log(`✓ Reusing scan job ${ reusable.metadata.name }`);

      return reusable.metadata.name;
    }

    const created = await request.post(SCANJOBS_API, {
      headers,
      data: {
        type:       'sbomscanner.kubewarden.io.scanjob',
        apiVersion: 'sbomscanner.kubewarden.io/v1alpha1',
        kind:       'ScanJob',
        metadata:   { generateName: `${ REGISTRY }-`, namespace: NAMESPACE },
        spec:       { registry: REGISTRY },
      },
    });

    await expectOk(created, 'Creating scan job');
    const name = (await created.json()).metadata.name;

    console.log(`✓ Started scan job ${ name }`);

    return name;
  });

  await setup.step('the scan completes', async () => {
    let job: ScanJob | undefined;

    await expect.poll(async () => {
      const response = await request.get(`${ SCANJOBS_API }/${ NAMESPACE }/${ scanJobName }`);

      await expectOk(response, `Reading scan job ${ scanJobName }`);
      job = await response.json();

      // Stop polling on failure; the assertion below reports why.
      return hasCondition(job!, 'Complete') || hasCondition(job!, 'Failed');
    }, {
      message:   `Scan job ${ scanJobName } did not finish within ${ SCAN_TIMEOUT / 60_000 } minutes`,
      timeout:   SCAN_TIMEOUT,
      intervals: [5_000, 10_000, 15_000],
    }).toBe(true);

    const failed = job!.status?.conditions?.find((c) => c.type === 'Failed' && c.status === 'True');

    expect(failed, `Scan job ${ scanJobName } failed: ${ failed?.reason } ${ failed?.message }`).toBeUndefined();
    console.log(`✓ Scan job ${ scanJobName } completed`);
  });
});
