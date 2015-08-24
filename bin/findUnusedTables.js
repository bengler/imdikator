/* eslint-disable no-console, import/default */
import groups from '../data/groups.json'
import tableMetadata from '../data/tables.json'
import data from '../node_modules/@bengler/imdi-dataset/out/tree.json'

const tablesInUse = []

const tableMetaDict = tableMetadata.reduce((p, n) => {
  p[n.label] = n
  return p
}, {})

groups.forEach(group => {
  group.items.forEach(t => {
    tablesInUse[t.table] = t
  })
})

const allTables = Object.keys(data)
const outstandingTables = allTables.filter(table => {
  return !tablesInUse[table]
})
console.info('Om nom nom')

console.info('Tables not in use')
console.info(outstandingTables)
console.info('----')

// outstandingTables = [outstandingTables[4]]

const tableDescriptions = []

outstandingTables.forEach(tableName => {

  const table = data[tableName]
  const tableDimensions = deletePlaceNames(byFirstKey(byFirstKey(table)))

  const variables = []
  searchTable(tableDimensions, variables, 0)

  // innvkat_3:alle utd_4: grunnskole, vgs, universitet_og_hogskole, uoppgitt_ingen kjonn:0,1

  const specString = variables.map(v => {
    return v.label + ':' + v.include.join('', '')
  }).join('')

  const metaLookup = tableMetaDict[tableName]
  const meta = {}
  if (metaLookup) {
    meta.name = metaLookup.name
    meta.descripton = metaLookup.descripton
    meta.category = metaLookup.category
  } else {
    console.info('Coult not find metadata for ' + tableName)
  }

  tableDescriptions.push({
    table: tableName,
    specString: specString,
    meta: meta
  })

})

console.info(tableDescriptions)


function searchTable(tableDimensions, variables, level) {
  if (typeof tableDimensions === 'string') {
    return
  }

  let spec = variables[level]
  if (spec === void 0) {
    spec = variables[level] = {
      label: '',
      include: []
    }
  }

  spec.label = Object.keys(tableDimensions)[0]
  const categories = Object.keys(tableDimensions[spec.label])

  // spec.include = spec.include.concat(categories)
  spec.include = categories

  variables[level] = spec

  categories.forEach(c => {
    searchTable(tableDimensions[spec.label][c], variables, level + 1)
  })
}

function deletePlaceNames(obj) {
  const deleteMe = ['bydel_nr', 'bydel_navn', 'fylke_nr', 'fylke_navn', 'kommune_nr', 'Kommune_navn']
  deleteMe.forEach(deleteProp => delete obj[deleteProp])
  return obj
}

function byFirstKey(tree) {
  return tree[Object.keys(tree)[0]]
}
