so we need to have a folder for the ionic front end, amplify, and serverless functions. maybe a parent serverless that sets up the auth, then child ones for the lambdas?


This is tested locally and not fully deployed with RDS. (can't afford the test)
Run install.sh

Run deploy.sh

replace line 37 in src/aws-exports.ts -> endpoint: 'http://localhost:3000/dev'

If you don't want it to run locally.

Run deploy-remote.sh
