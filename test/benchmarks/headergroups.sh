#!/usr/bin/env bash

# This is just a random selection of a few tables
TABLES=(
  arbledige_innvkat_land
  befolkning_botid
  barnehagedeltakelse
  befolkning_innvandringsgrunn
)

echo
echo "# Header groups"

for TABLE in "${TABLES[@]}"
do
  ab_cmd="ab -n 100 -c 10 http://imdifakta.azurewebsites.net/api/v1/metadata/headergroups/$TABLE"

  echo
  echo "## For table: $TABLE"
  echo "\`\$ $ab_cmd\`"
  echo "\`\`\`"
  $ab_cmd
  echo "\`\`\`"
done
