yarn build:server
docker build -t crossflow:latest .
docker-compose up -d
docker exec -it crossflow /bin/bash
