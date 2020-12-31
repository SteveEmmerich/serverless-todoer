#!/bin/bash
sed -i '' '/^#.*database-instance.*$/s/^#\ //' serverless.yml

serverless deploy
sleep 5s

cd services
cd todo-api
serverless deploy
sleep 5s

cd ../../
npm run build

amplify push --y

echo "Press any key to continue"
read