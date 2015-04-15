const request = require('../lib/request');
const http = require('http');
const csv = require('csv-parse');
const fs = require('fs');
const RxNode = require('rx-node');
const Rx = require('rx');
const debug = require('debug')("imdikator:import-labels");

const DOCS_URL = `https://docs.google.com/spreadsheets/d/1VEn9mXBh630Ww1ZsVkF-ykQ5E2Z7rBbFNDy_bjK7F0o/export`;
const DOC_ID = `1VEn9mXBh630Ww1ZsVkF-ykQ5E2Z7rBbFNDy_bjK7F0o`;

function fetchSheetExport({format, gid}) {
  return request.get(DOCS_URL, {format: format || 'csv', id: DOC_ID, gid})
}
const outFile = "./data/tables.json";

function csvToObjects(rs) {
  const rows = RxNode.fromReadableStream(rs.pipe(csv()));
  return rows
    .skip(1)
    .withLatestFrom(rows.take(1), (row, header) => {
      return row.reduce((rowObj, cell, i) => {
        // Map header[i] => row[i]
        rowObj[header[i]] = cell;
        return rowObj;
      }, {});
    });
}

const TABLES_SHEET_ID = 1205232570;
const VARIABLES_SHEET_ID = 385917427;


const tables = csvToObjects(fetchSheetExport(TABLES_SHEET_ID))
  .map(row => {
    const mappings = {
      Tabellnr: "id",
      Tabellnavn: "name",
      Tabellnavn_kort: "label",
      Kategori: "category",
      Tabellbeskrivelse: "description"
    }

    return Object.keys(mappings).reduce((mapped, key)=> {
      mapped[mappings[key]] = row[key];
      return mapped;
    }, {})
  })
  .tap(debug)
  .toArray()
  .flatMap(tables => {
    return Rx.Observable.fromNodeCallback(fs.writeFile)(outFile, JSON.stringify(tables, null, 2));
  })
  .subscribe(()=> {
    console.log("Done")
  })