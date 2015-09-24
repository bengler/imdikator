import Bluebird from 'bluebird'
import fs from 'fs'
import RxNode from 'rx-node'
import {pick} from 'lodash'
import csv from 'csv-parse'

const writeFile = Bluebird.promisify(fs.writeFile)

const log = console.log.bind(console) // eslint-disable-line

const CSV_FILE_FYLKER_KOMMUNER = './import/regioninndeling-fylker-kommuner.csv'
const CSV_FILE_KOMMUNER_BYDELER = './import/regioninndeling-kommuner-bydeler.csv'

function leftPad(str, padding, len) {
  let pad = ''
  while (pad.length < len) {
    pad += padding
  }
  return pad.substring(str.length) + str
}


const parsedRegions = csvToObjects(CSV_FILE_FYLKER_KOMMUNER)

const fylker = parsedRegions
  .distinct(region => region.Fylkenr)
  .map(pickKeys('Fylkenr', 'Fylkenavn'))
  .map(renameKeys({
    Fylkenr: 'code',
    Fylkenavn: 'name'
  }))
  .map(fylke => {
    fylke.type = 'fylke'
    fylke.code = leftPad(fylke.code, '0', 2)
    return fylke
  })
  .toArray()
  .flatMap(serializeTo('./data/fylker.json'))

const kommuner = parsedRegions
  .distinct(region => region.Kommunenr)
  .map(pickKeys('Kommunenr', 'Kommunenavn', 'Fylkenr', 'IMDiRegion', 'Næringsregionnr', 'Sentralitet_nr_2008', 'Sentralitet_kat_2008'))
  .map(renameKeys({
    Kommunenr: 'code',
    Kommunenavn: 'name',
    Fylkenr: 'fylkeCode',
    IMDiRegion: 'imdiRegion',
    Næringsregionnr: 'naeringsRegionCode',
    /* eslint-disable camelcase */
    Sentralitet_nr_2008: 'centralityNumber',
    Sentralitet_kat_2008: 'centralityName'
    /* eslint-enable camelcase */
  }))
  .map(kommune => {
    if (kommune.name === 'Oslo kommune') {
      kommune.name = 'Oslo'
    }
    kommune.type = 'kommune'
    kommune.code = leftPad(kommune.code, '0', 4)

    return kommune
  })
  .toArray()
  .flatMap(serializeTo('./data/kommuner.json'))

const naeringsregioner = parsedRegions
  .distinct(region => region['Næringsregionnr'])
  .map(pickKeys('Næringsregionnr', 'Næringsregion_ navn'))
  .map(renameKeys({
    Næringsregionnr: 'code',
    'Næringsregion_ navn': 'name',
    Kommunenr: 'municipalityCode',
  }))
  .map(naeringsregion => {
    naeringsregion.type = 'naeringsregion'
    naeringsregion.code = leftPad(naeringsregion.code, '0', 2)
    return naeringsregion
  })
  .toArray()
  .flatMap(serializeTo('./data/naeringsregioner.json'))

const bydeler = csvToObjects(CSV_FILE_KOMMUNER_BYDELER)
  .distinct(region => region.bydelsnr)
  .map(pickKeys('bydelsnr', 'bydelsnavn'))
  .map(renameKeys({
    bydelsnr: 'code',
    bydelsnavn: 'name',
    Kommunenr: 'kommuneCode'
  }))
  .map(bydel => {
    bydel.type = 'bydel'
    bydel.code = leftPad(bydel.code, '0', 6)
    return bydel
  })
  .toArray()
  .flatMap(serializeTo('./data/bydeler.json'))

naeringsregioner.subscribe(res => log('Wrote %s næringsregioner to %s', res.entries.length, res.file))
kommuner.subscribe(res => log('Wrote %s kommuner to %s', res.entries.length, res.file))
bydeler.subscribe(res => log('Wrote %s bydeler to %s', res.entries.length, res.file))
fylker.subscribe(res => log('Wrote %s fylker to %s', res.entries.length, res.file))

// A few helper functions

function csvToObjects(file) {
  const rows = RxNode.fromReadableStream(fs.createReadStream(file).pipe(csv()))
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

function renameKeys(keyNamesMap) {
  return function (object) {
    const knownKeyNames = Object.keys(keyNamesMap)
    return Object.keys(object).reduce((renamed, key) => {
      if (!knownKeyNames.includes(key)) {
        throw new Error(`Don't know what to rename the key '${key}' to`)
      }
      renamed[keyNamesMap[key]] = object[key]
      return renamed
    }, {})
  }
}

function pickKeys(...keys) {
  return function (object) {
    return pick(object, ...keys)
  }
}

function serializeTo(file) {
  return function serialize(entries) {
    return writeFile(file, JSON.stringify(entries, null, 2)).then(() => {
      return {file, entries}
    })
  }
}
