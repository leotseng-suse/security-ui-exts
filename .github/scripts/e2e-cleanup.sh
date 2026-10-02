#!/usr/bin/env bash
# Remove everything .github/workflows/e2e-ui.yml installs, for every environment (rke2 | k3s | docker),
# so a reused (self-hosted) runner starts the next run clean. Safe to run when nothing is installed.
set -uo pipefail

CLUSTER_NAME=${CLUSTER_NAME:-e2e-ui}

# Extension dev server started by "Build and serve extension from source"
pkill -f 'serve-pkgs' || true

# docker: Rancher container and its anonymous volumes
docker rm -f -v rancher 2>/dev/null || true

# k3s: k3d cluster and the docker.io pull-through registry created by kubewarden-end-to-end-tests/k3d-config.yaml
if command -v k3d >/dev/null; then
    k3d cluster delete "$CLUSTER_NAME" || true
fi
docker rm -f -v k3d-docker.io 2>/dev/null || true

# rke2: uninstaller removes the service, binaries, /etc/rancher and /var/lib/rancher
if [ -x /usr/local/bin/rke2-uninstall.sh ]; then
    sudo /usr/local/bin/rke2-uninstall.sh || true
fi

# Client-side state
helm registry logout dp.apps.rancher.io 2>/dev/null || true
for repo in $(helm repo list -o json 2>/dev/null | jq -r '.[].name | select(test("^(e2e-rancher-.*|jetstack|cnpg|kubewarden|security-ui-exts)$"))'); do
    helm repo remove "$repo" >/dev/null || true
done
rm -f ~/.kube/config
