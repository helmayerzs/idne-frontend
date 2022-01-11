#!/bin/bash

echo "|=====================================================|"
echo "Creating release package..."
echo "Version: $1  "
echo "Environment: ${2^^}"
echo "|=====================================================|"

read -p "Press any key to continue ..."

docker build --build-arg BUILD_ENV=$2 -t idne-frontend:$1-SNAPSHOT .
docker tag idne-frontend:$1-SNAPSHOT harbor.pockitsolutions.hu/idne/idne-frontend:$1-SNAPSHOT
docker push harbor.pockitsolutions.hu/idne/idne-frontend:$1-SNAPSHOT

read -p "Press any key to exit ..."
$SHELL
