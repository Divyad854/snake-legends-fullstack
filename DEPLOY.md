# Deploying Snake Legends to Kubernetes

This adds Docker images and manifests for `backend/`, `frontend/`, and a
`k8s/` folder of plain YAML files (no Helm needed).

```
backend/Dockerfile
frontend/Dockerfile
frontend/nginx.conf
k8s/
  00-namespace.yaml
  01-backend-pvc.yaml          # persists the SQLite file
  02-backend-deployment.yaml
  03-backend-service.yaml      # internal ClusterIP, name "backend"
  04-frontend-deployment.yaml
  05-frontend-service.yaml
  06-ingress.yaml               # external access (needs an ingress controller)
```

How it fits together: the frontend container is nginx serving the built
React app, and nginx itself proxies `/api/*` to the backend Service over the
cluster's internal DNS (`http://backend:8000`). So the browser only ever
talks to the frontend's origin — no CORS headaches, no separate API domain
needed.

## 0. Prerequisites

- A running Kubernetes cluster and `kubectl` pointed at it (`kubectl cluster-info` should work)
- Docker installed locally, and a place to push images: Docker Hub, GHCR,
  GCR, ECR, or whatever your cluster can pull from
- (Optional, for `06-ingress.yaml`) an ingress controller installed, e.g.:
  ```bash
  kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.2/deploy/static/provider/cloud/deploy.yaml
  ```

## 1. Build & push the images

Replace `YOUR_REGISTRY` with your actual registry/username throughout.

```bash
cd snake-legends-fullstack

docker build -t YOUR_REGISTRY/snake-legends-backend:latest ./backend
docker build -t YOUR_REGISTRY/snake-legends-frontend:latest ./frontend

docker push YOUR_REGISTRY/snake-legends-backend:latest
docker push YOUR_REGISTRY/snake-legends-frontend:latest
```

(If your cluster is local — Docker Desktop, minikube, kind — you can often
skip the registry and load images directly instead, e.g. `minikube image load ...`
or `kind load docker-image ...`.)

## 2. Point the manifests at your images

Edit these two lines:
- `k8s/02-backend-deployment.yaml` → `image: YOUR_REGISTRY/snake-legends-backend:latest`
- `k8s/04-frontend-deployment.yaml` → `image: YOUR_REGISTRY/snake-legends-frontend:latest`

## 3. Apply everything with kubectl

```bash
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/ -n snake-legends
```

Watch it come up:

```bash
kubectl get pods -n snake-legends -w
```

You should see `backend-xxxx` and two `frontend-xxxx` pods reach `Running`/`1/1`.

## 4. Reach the app

**Option A — quick check, no ingress:**
```bash
kubectl port-forward -n snake-legends svc/frontend 8080:80
```
Open http://127.0.0.1:8080

**Option B — LoadBalancer (cloud clusters: EKS/GKE/AKS, etc.):**
```bash
kubectl patch svc frontend -n snake-legends -p '{"spec":{"type":"LoadBalancer"}}'
kubectl get svc frontend -n snake-legends   # wait for an EXTERNAL-IP
```

**Option C — Ingress (what's in `06-ingress.yaml`):**
1. Edit `host: snake.example.com` to your real domain
2. `kubectl apply -f k8s/06-ingress.yaml`
3. Point that domain's DNS at your ingress controller's external IP

## 5. Updating after a code change

```bash
docker build -t YOUR_REGISTRY/snake-legends-backend:latest ./backend
docker push YOUR_REGISTRY/snake-legends-backend:latest
kubectl rollout restart deployment/backend -n snake-legends
```
(same pattern for the frontend)

## Notes & limits

- **SQLite + replicas:** the backend Deployment is pinned to `replicas: 1`
  because SQLite doesn't handle concurrent writers from multiple pods well.
  The frontend (stateless nginx) scales fine at `replicas: 2+`. If you need
  to scale the backend, swap SQLite for Postgres (a small change in
  `backend/app/database.py`) and run it as its own Deployment + PVC, or use
  a managed database.
- **CORS_ORIGINS:** defaults to `*` in the Deployment env. Since the
  frontend now proxies `/api` through nginx on the same origin, you don't
  strictly need to loosen CORS at all — you can leave this as-is or lock it
  down to your real domain.
- **Secrets:** there's nothing sensitive to store here (no API keys), so no
  `Secret` manifest was needed. If you add one later (e.g. swapping to a
  hosted Postgres with a password), use `kubectl create secret generic ...`
  rather than putting it in the YAML.
