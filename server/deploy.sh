  
#!/bin/bash

echo What should the version be?
read VERSION

docker build -t esdrasamora/lireddit:$VERSION .
docker push esdrasamora/lireddit:$VERSION
ssh root@167.172.128.127 "docker pull esdrasamora/lireddit:$VERSION && docker tag esdrasamora/lireddit:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"

echo Press enter to finish
read ENTER