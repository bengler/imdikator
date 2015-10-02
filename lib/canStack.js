export function canStack(query, data) {
  if (query) {
    const yearCondition = query.dimensions.find(item => item.name === 'aar')
    if (yearCondition && yearCondition.variables.length > 1) {
      return false
    }
  }

  if (data) {
    if (!data.every(item => !isNaN(item.tabellvariabel))) {
      return false
    }
  }

  return true
}
