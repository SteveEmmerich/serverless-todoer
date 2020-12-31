#!/bin/bash

rm -rf db.log
docker-compose up | cat > db.log &
sleep 10s

sed -i '' '/[^#]/ s/\(^.*database-instance.*$\)/#\ \1/' serverless.yml
rm -rf deploy.log
serverless deploy | cat > deploy.log &
sleep 5s

cd services
cd todo-api
rm -rf api.log
serverless offline  | cat > api.log &
sleep 5s

cd ../../
npm run start


echo "Press any key to continue"
read