export function chartForQuery(query, preferredChartKind) {
  if (query.include && query.include.aar) {
    if (query.include.aar.length > 1) {
      // TODO: Move specific knowledge out to config?
      const possibleCharts = ['line', 'stackedArea']
      if (possibleCharts.indexOf(preferredChartKind) != -1) {
        return preferredChartKind
      }
      return possibleCharts[0]
    }
  }
  return preferredChartKind
}
