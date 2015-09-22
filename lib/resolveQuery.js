export default function resolveQuery(srcQuery, tableMetaData) {

  const targetQuery = Object.assign({}, srcQuery, {
    region: srcQuery.region,
    tableName: srcQuery.tableName,
    dimensions: srcQuery.dimensions.slice()
  })

  if (srcQuery.time === 'latest') {
    targetQuery.dimensions.push({
      name: 'aar',
      variables: [tableMetaData.uniqueValues.aar[0]]
    })
  }

  if (srcQuery.time === 'all') {
    targetQuery.dimensions.push({
      name: 'aar'
    })
  }

  return targetQuery

  //// Todo: extend card.query
  //if (tab.canStack) {
  //  if (shouldStack) {
  //    return {
  //      "TableName": "sysselsattekjonnland",
  //      "Conditions": {
  //        "kjonn": [
  //          // Usually only gender can stack
  //          "0",
  //          "1"
  //        ]
  //      },
  //      "Include": [
  //        "kjonn"
  //      ],
  //      "Exclude": []
  //    }
  //  }
  //  query = {
  //    "TableName": "sysselsattekjonnland",
  //    "Conditions": {
  //      "kjonn": [
  //        // note: not stacked
  //        "alle"
  //      ]
  //    },
  //    "Include": [
  //      "kjonn"
  //    ],
  //    "Exclude": []
  //  }
  //}
}
