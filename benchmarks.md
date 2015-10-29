
# Tables
`$ ab -n 100 -c 10 http://imdikator-st.azurewebsites.net/api/v1/metadata/tables`
```
This is ApacheBench, Version 2.3 <$Revision: 1663405 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking imdikator-st.azurewebsites.net (be patient).....done


Server Software:        Microsoft-IIS/8.0
Server Hostname:        imdikator-st.azurewebsites.net
Server Port:            80

Document Path:          /api/v1/metadata/tables
Document Length:        1092 bytes

Concurrency Level:      10
Time taken for tests:   8.024 seconds
Complete requests:      100
Failed requests:        0
Total transferred:      150600 bytes
HTML transferred:       109200 bytes
Requests per second:    12.46 [#/sec] (mean)
Time per request:       802.416 [ms] (mean)
Time per request:       80.242 [ms] (mean, across all concurrent requests)
Transfer rate:          18.33 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:       31   42   8.0     38      57
Processing:   253  727 232.4    702    1681
Waiting:      252  726 232.7    702    1681
Total:        292  768 232.9    752    1732

Percentage of the requests served within a certain time (ms)
  50%    752
  66%    821
  75%    899
  80%    901
  90%   1052
  95%   1149
  98%   1510
  99%   1732
 100%   1732 (longest request)
```

# Header groups

## For table: arbledige_innvkat_land
`$ ab -n 100 -c 10 http://imdikator-st.azurewebsites.net/api/v1/metadata/headergroups/arbledige_innvkat_land`
```
This is ApacheBench, Version 2.3 <$Revision: 1663405 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking imdikator-st.azurewebsites.net (be patient).....done


Server Software:        Microsoft-IIS/8.0
Server Hostname:        imdikator-st.azurewebsites.net
Server Port:            80

Document Path:          /api/v1/metadata/headergroups/arbledige_innvkat_land
Document Length:        4267 bytes

Concurrency Level:      10
Time taken for tests:   1.364 seconds
Complete requests:      100
Failed requests:        0
Total transferred:      468100 bytes
HTML transferred:       426700 bytes
Requests per second:    73.33 [#/sec] (mean)
Time per request:       136.377 [ms] (mean)
Time per request:       13.638 [ms] (mean, across all concurrent requests)
Transfer rate:          335.20 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:       33   42   8.7     39      62
Processing:    50   90  37.3     75     193
Waiting:       49   89  37.3     75     191
Total:         84  132  40.3    120     241

Percentage of the requests served within a certain time (ms)
  50%    120
  66%    152
  75%    157
  80%    166
  90%    190
  95%    221
  98%    240
  99%    241
 100%    241 (longest request)
```

## For table: befolkning_botid
`$ ab -n 100 -c 10 http://imdikator-st.azurewebsites.net/api/v1/metadata/headergroups/befolkning_botid`
```
This is ApacheBench, Version 2.3 <$Revision: 1663405 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking imdikator-st.azurewebsites.net (be patient).....done


Server Software:        Microsoft-IIS/8.0
Server Hostname:        imdikator-st.azurewebsites.net
Server Port:            80

Document Path:          /api/v1/metadata/headergroups/befolkning_botid
Document Length:        4580 bytes

Concurrency Level:      10
Time taken for tests:   1.369 seconds
Complete requests:      100
Failed requests:        0
Total transferred:      499400 bytes
HTML transferred:       458000 bytes
Requests per second:    73.03 [#/sec] (mean)
Time per request:       136.926 [ms] (mean)
Time per request:       13.693 [ms] (mean, across all concurrent requests)
Transfer rate:          356.17 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:       32   38   6.0     35      58
Processing:    53   89  33.8     76     200
Waiting:       52   88  33.4     75     200
Total:         87  127  35.4    115     239

Percentage of the requests served within a certain time (ms)
  50%    115
  66%    138
  75%    148
  80%    152
  90%    179
  95%    196
  98%    233
  99%    239
 100%    239 (longest request)
```

## For table: barnehagedeltakelse
`$ ab -n 100 -c 10 http://imdikator-st.azurewebsites.net/api/v1/metadata/headergroups/barnehagedeltakelse`
```
This is ApacheBench, Version 2.3 <$Revision: 1663405 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking imdikator-st.azurewebsites.net (be patient).....done


Server Software:        Microsoft-IIS/8.0
Server Hostname:        imdikator-st.azurewebsites.net
Server Port:            80

Document Path:          /api/v1/metadata/headergroups/barnehagedeltakelse
Document Length:        8599 bytes

Concurrency Level:      10
Time taken for tests:   1.624 seconds
Complete requests:      100
Failed requests:        0
Total transferred:      901300 bytes
HTML transferred:       859900 bytes
Requests per second:    61.56 [#/sec] (mean)
Time per request:       162.440 [ms] (mean)
Time per request:       16.244 [ms] (mean, across all concurrent requests)
Transfer rate:          541.85 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:       32   38   5.9     35      52
Processing:    87  117  32.4    106     289
Waiting:       53   80  30.4     70     238
Total:        120  155  35.6    145     340

Percentage of the requests served within a certain time (ms)
  50%    145
  66%    164
  75%    172
  80%    176
  90%    199
  95%    230
  98%    254
  99%    340
 100%    340 (longest request)
```

## For table: befolkning_innvandringsgrunn
`$ ab -n 100 -c 10 http://imdikator-st.azurewebsites.net/api/v1/metadata/headergroups/befolkning_innvandringsgrunn`
```
This is ApacheBench, Version 2.3 <$Revision: 1663405 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking imdikator-st.azurewebsites.net (be patient).....done


Server Software:        Microsoft-IIS/8.0
Server Hostname:        imdikator-st.azurewebsites.net
Server Port:            80

Document Path:          /api/v1/metadata/headergroups/befolkning_innvandringsgrunn
Document Length:        4262 bytes

Concurrency Level:      10
Time taken for tests:   1.460 seconds
Complete requests:      100
Failed requests:        0
Total transferred:      467600 bytes
HTML transferred:       426200 bytes
Requests per second:    68.48 [#/sec] (mean)
Time per request:       146.030 [ms] (mean)
Time per request:       14.603 [ms] (mean, across all concurrent requests)
Transfer rate:          312.70 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:       29   38   6.4     36      54
Processing:    49  102  79.1     71     567
Waiting:       49  102  79.1     70     566
Total:         83  140  79.0    111     601

Percentage of the requests served within a certain time (ms)
  50%    111
  66%    135
  75%    153
  80%    163
  90%    222
  95%    328
  98%    443
  99%    601
 100%    601 (longest request)
```

# Queries
## Request payload (simple)
`$ ab -n 200 -c 10 -p test/benchmarks/queries/simple.json -T 'application/json' http://imdikator-st.azurewebsites.net/api/v1/query`
```json
{
  "TableName": "befolkning_hovedgruppe",
  "Include": [
    "innvkat5",
    "kjonn",
    "kommuneNr",
    "enhet",
    "aar"
  ],
  "Conditions": {
    "innvkat5": [
      "innvandrere",
      "bef_u_innv_og_norskf",
      "norskfodte_m_innvf"
    ],
    "kjonn": [
      "alle"
    ],
    "kommuneNr": [
      "0301"
    ],
    "enhet": [
      "personer"
    ],
    "aar": [
      "2015"
    ]
  }
}
```
### Benchmark results
```
This is ApacheBench, Version 2.3 <$Revision: 1663405 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking imdikator-st.azurewebsites.net (be patient)


Server Software:        Microsoft-IIS/8.0
Server Hostname:        imdikator-st.azurewebsites.net
Server Port:            80

Document Path:          /api/v1/query
Document Length:        0 bytes

Concurrency Level:      10
Time taken for tests:   2.905 seconds
Complete requests:      200
Failed requests:        0
Total transferred:      61000 bytes
Total body sent:        114000
HTML transferred:       0 bytes
Requests per second:    68.86 [#/sec] (mean)
Time per request:       145.228 [ms] (mean)
Time per request:       14.523 [ms] (mean, across all concurrent requests)
Transfer rate:          20.51 [Kbytes/sec] received
                        38.33 kb/s sent
                        58.84 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:       30   37   5.6     34      53
Processing:    39  106  51.9     86     269
Waiting:       39  106  51.9     86     269
Total:         76  143  53.3    128     319

Percentage of the requests served within a certain time (ms)
  50%    128
  66%    151
  75%    173
  80%    189
  90%    225
  95%    240
  98%    297
  99%    313
 100%    319 (longest request)
```
## Request payload (timeseries)
`$ ab -n 200 -c 10 -p test/benchmarks/queries/timeseries.json -T 'application/json' http://imdikator-st.azurewebsites.net/api/v1/query`
```json
{
  "TableName": "befolkning_hovedgruppe",
  "Include": [
    "innvkat5",
    "kjonn",
    "kommuneNr",
    "enhet",
    "aar"
  ],
  "Conditions": {
    "innvkat5": [
      "innvandrere",
      "bef_u_innv_og_norskf",
      "norskfodte_m_innvf"
    ],
    "kjonn": [
      "alle"
    ],
    "kommuneNr": [
      "0301"
    ],
    "enhet": [
      "personer"
    ]
  }
}
```
### Benchmark results
```
This is ApacheBench, Version 2.3 <$Revision: 1663405 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking imdikator-st.azurewebsites.net (be patient)


Server Software:        Microsoft-IIS/8.0
Server Hostname:        imdikator-st.azurewebsites.net
Server Port:            80

Document Path:          /api/v1/query
Document Length:        0 bytes

Concurrency Level:      10
Time taken for tests:   2.225 seconds
Complete requests:      200
Failed requests:        0
Total transferred:      61000 bytes
Total body sent:        107400
HTML transferred:       0 bytes
Requests per second:    89.89 [#/sec] (mean)
Time per request:       111.249 [ms] (mean)
Time per request:       11.125 [ms] (mean, across all concurrent requests)
Transfer rate:          26.77 [Kbytes/sec] received
                        47.14 kb/s sent
                        73.91 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:       31   37   5.7     34      52
Processing:    38   73  32.8     59     158
Waiting:       38   73  32.8     59     158
Total:         70  109  34.6     95     208

Percentage of the requests served within a certain time (ms)
  50%     95
  66%    112
  75%    124
  80%    138
  90%    171
  95%    187
  98%    199
  99%    207
 100%    208 (longest request)
```
## Request payload (timeseries-multi-region)
`$ ab -n 200 -c 10 -p test/benchmarks/queries/timeseries-multi-region.json -T 'application/json' http://imdikator-st.azurewebsites.net/api/v1/query`
```json
{
  "TableName": "befolkning_hovedgruppe",
  "Include": [
    "innvkat5",
    "kjonn",
    "kommuneNr",
    "enhet",
    "aar"
  ],
  "Conditions": {
    "innvkat5": [
      "alle"
    ],
    "kjonn": [
      "alle"
    ],
    "kommuneNr": [
      "0301",
      "0104",
      "0105",
      "0106",
      "0219",
      "0220",
      "0228",
      "0235",
      "0230",
      "0602",
      "1001",
      "1102",
      "0231",
      "1601",
      "1201",
      "1103"
    ],
    "enhet": [
      "personer"
    ]
  }
}
```
### Benchmark results
```
This is ApacheBench, Version 2.3 <$Revision: 1663405 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking imdikator-st.azurewebsites.net (be patient)


Server Software:        Microsoft-IIS/8.0
Server Hostname:        imdikator-st.azurewebsites.net
Server Port:            80

Document Path:          /api/v1/query
Document Length:        0 bytes

Concurrency Level:      10
Time taken for tests:   2.892 seconds
Complete requests:      200
Failed requests:        0
Total transferred:      61000 bytes
Total body sent:        136400
HTML transferred:       0 bytes
Requests per second:    69.15 [#/sec] (mean)
Time per request:       144.611 [ms] (mean)
Time per request:       14.461 [ms] (mean, across all concurrent requests)
Transfer rate:          20.60 [Kbytes/sec] received
                        46.06 kb/s sent
                        66.65 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:       29   37   6.0     34      53
Processing:    39  104  54.9     96     277
Waiting:       39  104  54.9     96     277
Total:         71  141  55.2    131     328

Percentage of the requests served within a certain time (ms)
  50%    131
  66%    156
  75%    169
  80%    174
  90%    206
  95%    285
  98%    302
  99%    314
 100%    328 (longest request)
```
