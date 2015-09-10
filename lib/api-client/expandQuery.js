/**
 * Takes a dynamic (context free) query and converts it into a Visma API compliant query with dynamic values like 'year: latest'
 * replaces with 'year: 2015' (if that is the latest available year in the dataset)
 * @param srcQuery
 * @param region
 * @param tableMetaData
 * @returns {{tableName: *, conditions: {}, include: Array}}
 */
export default function expandQuery(srcQuery, region, tableMetaData) {

  const targetQuery = {
    tableName: srcQuery.table,
    conditions: {},
    include: []
  }

  if (srcQuery.time === 'latest') {
    targetQuery.conditions.aar = [tableMetaData.uniqueValues.aar[0]]
    targetQuery.include.push('aar', 'tabellvariabel', 'enhet')
  }

  srcQuery.dimensions.forEach(dimension => {
    targetQuery.include.push(dimension.label)
    targetQuery.conditions[dimension.label] = dimension.include
  })

  if (srcQuery.defaultUnit) {
    targetQuery.conditions.enhet = [srcQuery.defaultUnit]
  }

  // Todo: allow region to be switched later
  if (region.type === 'municipality') {
    targetQuery.conditions.kommuneId = [region.code]
  }

  return targetQuery
}
