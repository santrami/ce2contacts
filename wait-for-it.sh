#!/bin/bash
# wait-for-it.sh

host="$1"
shift
port="$1"
shift
cmd="$@"

until nc -z "$host" "$port"; do
  >&2 echo "Waiting for MySQL at $host:$port to be ready..."
  sleep 1
done

>&2 echo "MySQL is up - executing command"
exec $cmd
