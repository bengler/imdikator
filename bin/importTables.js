import fetchGoogleSheetExport from '../lib/fetchGoogleSheetExport'
import csv from 'csv-parse'
import fs from 'fs'
import RxNode from 'rx-node'
import Rx from 'rx'
import {prefix} from '../lib/debug'

const debug = prefix('imdikator:import-labels')

const SHEET_KEY = '1VEn9mXBh630Ww1ZsVkF-ykQ5E2Z7rBbFNDy_bjK7F0o'
const SHEET_GID = 1205232570

const OUTFILE = './data/tables.json'

function csvToObjects(rs) {
  const rows = RxNode.fromReadableStream(rs.pipe(csv()))
  return rows
    .skip(1)
    .withLatestFrom(rows.take(1), (row, header) => {
      return row.reduce((rowObj, cell, i) => {
        // Map header[i] => row[i]
        rowObj[header[i]] = cell
        return rowObj
      }, {})
    })
}

csvToObjects(fetchGoogleSheetExport(SHEET_KEY, SHEET_GID))
  .map(row => {
    const mappings = {
      Tabellnr: 'id',
      Tabellnavn: 'name',
      Tabellnavn_kort: 'label', // eslint-disable-line camelcase
      Kategori: 'category',
      Tabellbeskrivelse: 'description'
    }

    return Object.keys(mappings).reduce((mapped, key) => {
      mapped[mappings[key]] = row[key]
      return mapped
    }, {})
  })
  .tap(debug)
  .toArray()
  .flatMap(tables => {
    return Rx.Observable.fromNodeCallback(fs.writeFile)(OUTFILE, JSON.stringify(tables, null, 2))
  })
  .subscribe(() => {
    console.log('Done') // eslint-disable-line no-console
  })
