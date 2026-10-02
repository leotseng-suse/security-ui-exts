import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from "path";
import fs from 'fs';
export const STORAGE_STATE = path.join(__dirname, '/.auth/login-data.json');

// Load environment-specific .env file or default to .env
// Usage: ENV=dev npx playwright test (loads .env.dev)
//        ENV=staging npx playwright test (loads .env.staging)
//        npx playwright test (loads .env)
const envFile = process.env.ENV ? `.env.${process.env.ENV}` : '.env';
dotenv.config({ path: path.resolve(__dirname, '..', envFile) });

// Function to get UI version from uiversion.json
function getUIVersion(): string {
  const versionFilePath = path.join(__dirname, 'uiversion.json');
  try {
    if (fs.existsSync(versionFilePath)) {
      const content = fs.readFileSync(versionFilePath, 'utf-8').trim();
      if (!content) {
        return 'unknown';
      }
      const versionData = JSON.parse(content);

      // Try multiple possible paths in the JSON structure
      const version =
        versionData?.entries?.[0]?.version ||
        versionData?.entries?.['security-ui-exts']?.version ||
        versionData?.version ||
        versionData?.data?.[0]?.version ||
        'unknown';

      return version;
    }
  } catch (error) {
    console.log('Could not read UI version:', error);
  }
  return 'unknown';
}

// Get current date for run title
function getRunTitle(): string {
  const uiVersion = getUIVersion();
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const time = new Date().toTimeString().split(' ')[0]; // HH:MM:SS
  return `SBOM Scanner UI Test - v${uiVersion} - ${date} ${time}`;
}

export default defineConfig({
 //globalSetup: require.resolve('./global-setup'),
 
 testDir: './tests',
 ////fullyParallel: true,
 
  // 
  projects: [
    {
      name: 'setup',
      //testMatch: /global-setup.ts/,
      testMatch: ['**/*.setup.ts',
      ],
      
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],
              storageState: STORAGE_STATE,
       },
      dependencies: ['setup'],
    },
    
  ],

   testMatch: [
                //"tests/myfunctions.test.ts",

                "tests/sbomscanner_dashboard.test.ts",
                "tests/sbomscanner_images.test.ts",
                "tests/sbomscanner_registries.test.ts",
                "tests/sbomscanner_vex_management.test.ts",
                "tests/sbomscanner_workloads.test.ts",
              ],

  use: {
        baseURL: process.env.RANCHER_URL || "https://RANCHERURL",
        
        // CI runs headless at full speed; local runs keep the visible, slowed-down browser
        headless: !!process.env.CI,
    	  ignoreHTTPSErrors: true,
        screenshot: "on",
        video: process.env.CI ? "retain-on-failure" : "on",
        launchOptions: {
             slowMo: process.env.CI ? 0 : 500,
             args: ["--start-maximized"]
        },
        viewport: process.env.CI ? { width: 1600, height: 900 } : null,
    },

    //timeout: 60 * 1000 * 5,
    timeout: 90000,

    // Configurable retries via TEST_RETRIES environment variable (default: 3)
    retries: process.env.TEST_RETRIES ? parseInt(process.env.TEST_RETRIES) : 3,
    reporter: [
        ["dot"],
        ["json", {
            outputFile: "jsonReports/jsonReport.json"
        }],
        ["html", {
            open: "never"
        }],
        // playwright-qase-reporter v2 options; QASE_* env vars (QASE_TESTOPS_RUN_TITLE, ...) override these
        ["playwright-qase-reporter", {
            mode: process.env.QASE_MODE || 'off',
            testops: {
                api: {
                    token: process.env.QASE_TESTOPS_API_TOKEN,
                },
                project: process.env.QASE_TESTOPS_PROJECT,
                uploadAttachments: true,
                run: {
                    id: process.env.QASE_RUN_ID ? parseInt(process.env.QASE_RUN_ID) : undefined,
                    title: process.env.QASE_RUN_TITLE || getRunTitle(),
                    description: process.env.QASE_RUN_DESCRIPTION,
                    tags: process.env.QASE_RUN_TAGS ? process.env.QASE_RUN_TAGS.split(',') : undefined,
                },
            },
        }]
    ]

});
