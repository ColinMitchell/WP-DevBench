#!/usr/bin/env bash

set -euo pipefail

PLUGIN_PATH="web/app/plugins/wp-devbench"

docker-compose exec -T webserver bash -c "cd $PLUGIN_PATH && composer $*"
