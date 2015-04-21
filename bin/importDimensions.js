const fetchGoogleSheetExport = require('../lib/fetchGoogleSheetExport');
const csv = require('csv-parse');
const fs = require('fs');
const RxNode = require('rx-node');
const Rx = require('rx');
const debug = require('debug')("imdikator:import-labels");

const SHEET_KEY = '1VEn9mXBh630Ww1ZsVkF-ykQ5E2Z7rBbFNDy_bjK7F0o';
const SHEET_GID = 385917427;

const OUTFILE = "./data/dimensions.json";

const mappings = {
  Variabelbeskrivelse: 'description',
  'Kort variabelnavn': 'name',
  'Menneskelesbar variabelkategorier': 'variable',
  'Maskinlesbar kortkategori': 'variableLabel',
  'Sammenslått': 'merged',
  'brukt i tabellnr': 'tables',
  kodekommentar: 'comment'
}

const rows = csvToObjects(fetchGoogleSheetExport(SHEET_KEY, SHEET_GID))
  .map(row => {
    return Object.keys(mappings).reduce((mapped, key)=> {
      mapped[mappings[key]] = row[key];
      return mapped;
    }, {})
  });

const dimensions = rows.filter(row => row.name && row.description).map(row => {
  return {name: row.name, description: row.description, variables: []}
})

rows
  .map(variable => {
    return {
      name: variable.variable,
      label: variable.variableLabel,
      //merged: variable.merged || undefined,
      //tables: variable.tables.split(",").filter(Boolean),
      comment: variable.comment || undefined
    };
  })
  .withLatestFrom(dimensions, (variable, dimension) => {
    dimension.variables.push(variable);
    return dimension;
  })
  .distinct(dim => dim.name)
  .toArray()
  .flatMap(tables => {
    return Rx.Observable.fromNodeCallback(fs.writeFile)(OUTFILE, JSON.stringify(tables, null, 2));
  })
  .subscribe(()=> {
    console.log("Done")
  }, (error)=> {
    console.log("Error: ", error)
  })


function csvToObjects(rs) {
  const rows = RxNode.fromReadableStream(rs.pipe(csv()));
  return rows
    .skip(1)
    .map(row => row.map(cell => cell.trim()))
    .filter(row => row.some(cell => cell))
    .withLatestFrom(rows.take(1), (row, header) => {
      return row.reduce((rowObj, cell, i) => {
        // Map header[i] => row[i]
        rowObj[header[i]] = cell;
        return rowObj;
      }, {});
    });
}
