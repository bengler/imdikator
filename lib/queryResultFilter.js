export function queryResultFilter(rows, chartKind) {
  switch (chartKind) {
    case 'bubble': {
      return rows.filter(item => [':', '.', '0'].indexOf(item.tabellvariabel) == -1)
    }
    default: {
      return rows
    }
  }
}
