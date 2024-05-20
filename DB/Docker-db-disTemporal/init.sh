#!/bin/bash

sed -i 's/^listen_address: localhost/listen_address: 0.0.0.0/' /etc/cassandra/cassandra.yaml
sed -i 's/^rpc_address: localhost/rpc_address: 0.0.0.0/' /etc/cassandra/cassandra.yaml

exec /docker-entrypoint.sh "$@"