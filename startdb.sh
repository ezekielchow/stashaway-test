#!/bin/bash

docker-compose up

sleep 5

docker exec mongo /scripts/rs-init.sh
