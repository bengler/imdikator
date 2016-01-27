#!/usr/bin/env bash

QUERIES=(
  simple
  timeseries
  timeseries-multi-region
)

echo
echo "# Queries"

for QUERY in "${QUERIES[@]}"
do
  ab_cmd="ab -n 200 -c 10 -p test/benchmarks/queries/$QUERY.json -T 'application/json' http://imdifakta.azurewebsites.net/api/v1/query"

  echo "## Request payload ($QUERY)"
  echo "\`\$ $ab_cmd\`"
  echo "\`\`\`json"
  cat "test/benchmarks/queries/$QUERY.json"
  echo "\`\`\`"
  echo "### Benchmark results"
  echo "\`\`\`"
  $ab_cmd
  echo "\`\`\`"
done
