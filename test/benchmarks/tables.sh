#!/usr/bin/env bash

ab_cmd="ab -n 100 -c 10 http://imdikator-st.azurewebsites.net/api/v1/metadata/tables"

echo
echo "# Tables"
echo "\`\$ $ab_cmd\`"
echo "\`\`\`"
$ab_cmd
echo "\`\`\`"
