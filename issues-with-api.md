

- [minor] http://imdikator-st.azurewebsites.net/api/v1/metadata/headerswithvalues/befolkninghovedgruppe returns array of one element, but you can not ask for more than one table
- [minor] PascalCase in query:
```json
{
  "TableName": "befolkninghovedgruppe",
  "Conditions": {
      "aar": [
          "2014"
      ]
  },
  "Include": [
      "aar"
  ],
  "Exclude": []
}
```

- Not very helpful error messages. Whenever status = 500, response body is: {"Message":"An error has occurred."}
