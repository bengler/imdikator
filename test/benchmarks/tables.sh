#!/usr/bin/env bash

ab -n 100 -c 10 'http://imdikator-st.azurewebsites.net/api/v1/metadata/tables'
