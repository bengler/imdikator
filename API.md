
# `GET /api/v1/query?<params>`

E.g: 

`curl 'http://localhost:3000/api/v1/query?table=befolkning_hovedgruppe&regions%5B0%5D=K0301&dimensions%5B0%5D=innvkat_5%3Ainnvandrere%2Cbefolkningen_ellers%2Cnorskfodte_m_innvf&dimensions%5B1%5D=kjonn%3A0%2C1&time=latest'`

# A few examples:

## Doubly filtered

### Query:
```json
{
  "table": "videregaende_fullfort",
  "regions": ["F1"],
  "dimensions": ["kjonn:1", "innvkat_5:innvandrere"],
  "time": ["2011"]
}
```

### Response:
```json
{
  "table": "videregaende_fullfort",
  "time": ["2011"],
  "data": {
    "F1": {
      "kjonn": {
        "1": {
          "innvkat_5": {
            "innvandrere": {
              "personer": ["139"],
              "prosent": ["39"]
            }
          }
        }
      }
    }
  }
}
```


## Two dimensions, reversed

### Query:
```json
{
  "table": "videregaende_fullfort",
    "regions": ["F1"],
    "dimensions": ["kjonn:0,1", "innvkat_5"],
    "time": ["2011"]
}
```
### Response
```json
{
  "table": "videregaende_fullfort",
  "time": ["2011"],
  "data": {
    "F1": {
      "kjonn": {
        "0": {
          "innvkat_5": {
            "alle": {
              "personer": ["1226"],
              "prosent": ["71.2"]
            },
            "innvandrere": {
              "personer": ["371"],
              "prosent": ["68.3"]
            }
          }
        },
        "1": {
          "innvkat_5": {
            "alle": {
              "personer": ["1055"],
              "prosent": ["61.3"]
            },
            "innvandrere": {
              "personer": ["139"],
              "prosent": ["39"]
            }
          }
        }
      }
    }
  }
}
```
