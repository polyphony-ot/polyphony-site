#!/bin/bash

addr="staging.polyphony-ot.com"
dir="/home/polyphony/staging"

rsync -rtv --exclude "*.git" --exclude "deploy-staging.sh" ./ "$addr:$dir"
ssh "$addr" << EOF
	chmod -R u+rwX,go+rwX,o-w $dir
	chown -R :polyphony $dir
	sed -i 's/:51015/:51016/g' "$dir/scripts/polyphony-demo.js"
	sed -i 's/port: 51015/port: 51016/g' "$dir/server/lib/socket-server.js"
EOF
