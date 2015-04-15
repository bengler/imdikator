
# `GET /api/v1/query?<params>`

Where `<params>` is url encoded json with the following keys:

- `table`: the name of the table to read data from
- `regions`: an array of the regions to get data from
- `dimensions`: an array of the dimensions (+ variables) to return (see Specifying dimensions and variables below)
- `time`: Can be either an array of time points to filter by or `latest` for the latest available time point, or `all` for all available time points

### Specifying dimensions and variables

Format: `<dimension>:<variable>,<variable>`

- where `<dimension>` is the name of the dimension, e.g. `innvkat_5`
- where `<variable>` can be either `*`, `<name>` or `-<name>`

Examples:
- `innvkat_5:*` Includes all dimension `innvkat_5` and all variables
- `kjonn:1` Includes dimension `kjonn`, but only variable `1`
- `kjonn:1` Includes dimension `kjonn`, but only variable `1`
- `innvkat_5:*,-innvandrere` Includes all variables except innvandrere from dimension `innvkat_5`



### Example curl:

`curl 'http://localhost:3000/api/v1/query?table=befolkning_hovedgruppe&regions%5B0%5D=K0301&dimensions%5B0%5D=innvkat_5%3Ainnvandrere%2Cbefolkningen_ellers%2Cnorskfodte_m_innvf&dimensions%5B1%5D=kjonn%3A0%2C1&time=latest'`

# More examples:

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

### Data
```json
{
  "videregaende_fullfort": {
    "2011": {
      "F1": {
        "innvkat_5": {
          "alle": {
            "kjonn": {
              "0": {
                "personer": "1226",
                "prosent": "71.2"
              },
              "1": {
                "personer": "1055",
                "prosent": "61.3"
              },
              "alle": {
                "personer": "2281",
                "prosent": "66.3"
              }
            }
          },
          "innvandrere": {
            "kjonn": {
              "0": {
                "personer": "371",
                "prosent": "68.3"
              },
              "1": {
                "personer": "139",
                "prosent": "39"
              },
              "alle": {
                "personer": "210",
                "prosent": "53.9"
              }
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
### Response:
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

### Data
```json
{
  "videregaende_fullfort": {
    "2011": {
      "F1": {
        "innvkat_5": {
          "alle": {
            "kjonn": {
              "0": {
                "personer": "1226",
                "prosent": "71.2"
              },
              "1": {
                "personer": "1055",
                "prosent": "61.3"
              },
              "alle": {
                "personer": "2281",
                "prosent": "66.3"
              }
            }
          },
          "innvandrere": {
            "kjonn": {
              "0": {
                "personer": "371",
                "prosent": "68.3"
              },
              "1": {
                "personer": "139",
                "prosent": "39"
              },
              "alle": {
                "personer": "210",
                "prosent": "53.9"
              }
            }
          }
        }
      }
    }
  }
}
```
