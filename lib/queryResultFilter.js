export function queryResultFilter(rows, chartKind) {
  switch (chartKind) {
    case 'bubble': {
      const filtered = rows.filter(item => {
        // Remove "Alle"
        if (item.landbakgrunn && item.landbakgrunn == '1') {
          return false
        }
        // Remove empty data
        return item.tabellvariabel != '0'
      })
      return filtered
    }
    default: {
      return rows
    }
  }
}
