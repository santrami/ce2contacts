#!/bin/sh
# wait-for-it.sh

set -e

host="$1"
shift
cmd="$@"

until nc -z "$host" "${port:-3306}"; do
  >&2 echo "Waiting for MySQL to be ready..."
  sleep 1
done

>&2 echo "MySQL is up - executing command"
exec $cmd