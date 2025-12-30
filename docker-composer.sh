#!/usr/bin/env bash
set -euo pipefail

PLUGIN_PATH="web/app/plugins/wp-devbench"

ARGS=()
FILES=()

for arg in "$@"; do
  if [[ "$arg" == *".php" && "$arg" == *"wp-devbench"* ]]; then
    FILES+=( "${arg#*wp-devbench/}" )
  else
    ARGS+=( "$arg" )
  fi
done

docker-compose exec -T webserver bash -c "
  cd $PLUGIN_PATH &&
  composer ${ARGS[*]} ${FILES[*]:-.}
"
