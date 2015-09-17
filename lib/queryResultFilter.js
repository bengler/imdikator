export function queryResultFilter(rows, chartKind) {
  switch (chartKind) {
    case 'bubble': {
      const filtered = rows.filter(item => {
        if (item.landbakgrunn && item.landbakgrunn == '1') {
          return false
        }
        return [':', '.', '0'].indexOf(item.tabellvariabel) == -1
      })
      return filtered
    }
    default: {
      return rows
    }
  }
}
