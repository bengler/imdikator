export function fromVisma(query) {

}

export function fromJSON(query) {
  return Query(query)
}

function Query(query) {
  return {
    //constrain() {},
    getDimensionByName(name) {
      return query.dimensions.find(dim => dim.name === name)
    },
    get comparisonRegions() {
      return this.getDimensionByName('comparisonRegions')
    },
    get unit() {
      return this.getDimensionByName('unit')
    },
    get year() {
      return this.getDimensionByName('year')
    },
    get dimensions() {
      return query.dimensions
    }
  }
}
