import assert from 'assert'

const REGION_TYPE_TO_ID_MAPPING = {
  municipality: 'kommuneNr',
  county: 'fylkeNr',
  commerceRegion: 'naringsregionNr'
}


export default function resolveQuery(region, srcQuery, headerGroups) {

  const targetQuery = Object.assign({}, srcQuery, {
    region: srcQuery.region,
    tableName: srcQuery.tableName,
    dimensions: srcQuery.dimensions.slice()
  })

  const possibleValues = headerGroups.find(group => {
    return group.hasOwnProperty(REGION_TYPE_TO_ID_MAPPING[region.type])
  })

  assert(possibleValues, `No possible values found for region type ${region.type}`)

  if (srcQuery.time === 'latest') {

    targetQuery.dimensions.push({
      name: 'aar',
      variables: [possibleValues.aar[possibleValues.aar.length - 1]]
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
