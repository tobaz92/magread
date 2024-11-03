#!/bin/bash

docker build -t tobaz92/magread:back-latest -f ../back/Dockerfile --load ../back
docker build -t tobaz92/magread:reader-latest -f ../reader/Dockerfile --load ../reader
docker build -t tobaz92/magread:core-latest -f ../rust/core/Dockerfile --load ../rust/core
docker build -t tobaz92/magread:optimizer-latest -f ../rust/optimizer/Dockerfile --load ../rust/optimizer
