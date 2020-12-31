#!/bin/bash


docker-compose up &
sleep 10s

sed -i '' '/[^#]/ s/\(^.*database-instance.*$\)/#\ \1/' serverless.yml
serverless deploy
sleep 5s

cd services
cd todo-api
serverless offline &
sleep 5s

cd ../../
npm run start


echo "Press any key to continue"
read