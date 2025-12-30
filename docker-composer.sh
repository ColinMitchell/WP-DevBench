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

# Fallback to current directory if no files passed
if [ ${#FILES[@]} -eq 0 ]; then
  FILES=( "." )
fi

# -------------------------------
# Logging
# -------------------------------
echo ""
echo "🔧 WP DevBench Docker Runner"
echo "→ Plugin path : $PLUGIN_PATH"
echo "→ Composer cmd: composer ${ARGS[*]}"
echo "→ Files:"
for file in "${FILES[@]}"; do
  echo "   - $file"
done
echo "--------------------------------"

docker-compose exec -T webserver bash -c "
  cd $PLUGIN_PATH &&
  composer ${ARGS[*]} ${FILES[*]}
"
