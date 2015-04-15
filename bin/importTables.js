const request = require('../lib/request');
const fetchGoogleSheetExport = require('../lib/fetchGoogleSheetExport');
const csv = require('csv-parse');
const fs = require('fs');
const RxNode = require('rx-node');
const Rx = require('rx');
const debug = require('debug')("imdikator:import-labels");

const SHEET_KEY = '1VEn9mXBh630Ww1ZsVkF-ykQ5E2Z7rBbFNDy_bjK7F0o';
const SHEET_GID = 1205232570;

const OUTFILE = "./data/tables.json";

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

const tables = csvToObjects(fetchGoogleSheetExport(SHEET_KEY, SHEET_GID))
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
    return Rx.Observable.fromNodeCallback(fs.writeFile)(OUTFILE, JSON.stringify(tables, null, 2));
  })
  .subscribe(()=> {
    console.log("Done")
  })