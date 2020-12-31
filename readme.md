# SLS TODOER

---

Goals

- [x] Use serverless
- [x] Use amplify
- [x] CRUD operations
- [x] Use SQL database

---

Notes:
I tested everything locally and deployed all but RDS to aws though the configuration was validated.

Reference the ENV file to change defaults for the DB and AWS profile. Normally you would not commit this file but for this example I am including it.

---

## Instructions

---

- `cd todoer`
- `install.sh`

### Run locally using my cognito

- `docker-compose up | cat > db.log`
- `cd services/todo-api`
- `sls offline | cat > api.log`

- `cd ../../`
- `npm run start`

### Run Locally with your own cognito

- Change the env variable `AWS_PROFILE=amplify-sls-profile`

  - Either create a new aws profile and call it amplify-sls-profile or use an existing one you have.

- `install.sh`

- `deploy.sh`

- Replace line 37 in `src/aws-exports.ts` -> `endpoint: 'http://localhost:3000/dev'`

### Run Remotely totally

- Change the env variable `AWS_PROFILE=amplify-sls-profile`

  - Either create a new aws profile and call it amplify-sls-profile or use an existing one you have.

- `deploy-remote.sh`
