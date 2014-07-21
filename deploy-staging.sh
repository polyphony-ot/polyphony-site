#!/bin/bash

addr="staging.polyphony-ot.com"
dir="/home/polyphony/staging"

rsync -rtv --exclude "*.git" --exclude "deploy-staging.sh" ./ "$addr:$dir"
ssh "$addr" "chmod -R u+rwX,go+rwX,o-w $dir && chown -R :polyphony $dir"
