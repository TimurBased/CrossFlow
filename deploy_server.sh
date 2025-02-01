#! /bin/bash
yarn build:server
docker-compose -t tim/crossflow:latest
docker-compose up 
docker exec -it tim/crossflow /bin/bash
