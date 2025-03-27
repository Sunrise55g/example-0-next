#!/usr/bin/env bash
BASEDIR="$( cd "$(dirname "")" ; pwd -P )"
echo "Executing run_old for $1 in '$BASEDIR'"

docker-compose -f ./docker-compose-$1.yml build
docker-compose -f ./docker-compose-$1.yml up $2

echo "BASEDIR in '$BASEDIR'"
