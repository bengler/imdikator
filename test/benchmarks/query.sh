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
  echo "## Query $QUERY"
  echo "\`\`\`"
  cat "test/benchmarks/queries/$QUERY.json"
  echo "\`\`\`"
  echo "### Results"
  echo "\`\`\`"
  ab -n 200 -c 10 -p "test/benchmarks/queries/$QUERY.json" -T 'application/json' "http://imdikator-st.azurewebsites.net/api/v1/query"
  echo "\`\`\`"
done
