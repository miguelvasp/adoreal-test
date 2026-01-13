# Technical Assessment Workspace (Angular + .NET)

This repo is set up for a Senior Full Stack Engineer technical assessment.

## Project layout
- /frontend  (Angular app)
- /services/appointments-api  (ASP.NET Core API)
- /infra     (k8s yaml / helm / GH actions notes) 

## Run instructions

### Backend (.NET)
1) cd services/appointments-api
2) dotnet restore
3) dotnet run

### Frontend (Angular)
1) cd frontend
2) npm install
3) npm start

## API routes
- GET /health  -> returns service status
- GET /appts   -> returns all appointments
- POST /appts  -> creates an appointment

Sample payload:

```json
{
  "patientName": "Ada Lovelace",
  "startsAt": "2030-01-15T14:30:00Z",
  "notes": "Initial consultation"
}
```

## Frontend UI behavior
- Loads appointments on page load and offers a manual refresh.
- Shows loading and error states for fetch/create actions.
- Expects the API at `https://localhost:5001` (CORS enabled for `http://localhost:4200`).

## Kubernetes
- Manifests live in `infra/k8s` (Deployment, Service, Ingress, Secrets).
- See `infra/k8s/README.md` for env vars and secret placeholders.

## Notes
- Backend and frontend projects are created in Tasks 2 and 3.
- Verify using commands in .codex/50_COMMANDS.md when available.
