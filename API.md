

`
GET /api/v1/query?:params
`

# Example params:

## Doubly filtered

```json
{
  table: "videregaende_fullfort",
  regions: ["F1"],
  dimensions: ["kjonn:1", "innvkat_5:innvandrere"],
  time: ["2011"]
}
```

### Expected response

```json
{
  table: 'videregaende_fullfort',
  time: ['2011'],
  data: {
    "F1": {
      kjonn: {
        "1": {
          innvkat_5: {
            innvandrere: {
              personer: ["139"],
              prosent: ["39"]
            }
          }
        }
      }
    }
  }
}
```