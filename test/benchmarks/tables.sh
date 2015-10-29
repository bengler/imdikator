#!/usr/bin/env bash

echo
echo "# Tables"
echo "\`\`\`"
ab -n 100 -c 10 'http://imdikator-st.azurewebsites.net/api/v1/metadata/tables'
echo "\`\`\`"
