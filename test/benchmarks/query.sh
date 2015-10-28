#!/usr/bin/env bash

QUERIES=(
  simple
  timeseries
  timeseries-multi-region
)

for QUERY in "${QUERIES[@]}"
do
  ab -n 200 -c 10 -p "test/benchmarks/queries/$QUERY.json" -T 'application/json' "http://imdikator-st.azurewebsites.net/api/v1/query"
done
