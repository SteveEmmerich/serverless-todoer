#!/bin/bash
sed -i '' '/^#.*database-instance.*$/s/^#\ //' serverless.yml

serverless deploy | cat > deploy.log
sleep 5s

cd services
cd todo-api
serverless deploy | cat > api-deploy.log
sleep 5s

cd ../../
npm run build | cat > build.log

amplify push --y

echo "Press any key to continue"
read