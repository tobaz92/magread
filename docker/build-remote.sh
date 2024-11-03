#!/bin/bash

docker buildx build --platform linux/amd64,linux/arm64 -t tobaz92/magread:back-latest -f ../back/Dockerfile --push ../back
docker buildx build --platform linux/amd64,linux/arm64 -t tobaz92/magread:reader-latest -f ../reader/Dockerfile --push ../reader
docker buildx build --platform linux/amd64,linux/arm64 -t tobaz92/magread:core-latest -f ../rust/core/Dockerfile --push ../rust/core
docker buildx build --platform linux/amd64,linux/arm64 -t tobaz92/magread:optimizer-latest -f ../rust/optimizer/Dockerfile --push ../rust/optimizer
