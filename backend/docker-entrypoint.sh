#!/bin/sh
set -e

# Run auto-seed if AUTO_SEED is "true"
if [ "$AUTO_SEED" = "true" ]; then
  echo "[docker-entrypoint] AUTO_SEED=true: Verifying migrations and seeding initial database..."
  node dist/src/database/seeder.js || echo "[docker-entrypoint] Seeder warning: seed completed or skipped."
fi

exec "$@"
