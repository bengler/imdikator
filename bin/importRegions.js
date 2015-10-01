import Bluebird from 'bluebird'
import fs from 'fs'
import RxNode from 'rx-node'
import pick from 'lodash.pick'
import csv from 'csv-parse'
import assert from 'assert'

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
  .map(padKeys('0', 4, 'Kommunenr'))
  .map(padKeys('0', 2, 'Fylkenr'))
  .map(padKeys('0', 2, 'Næringsregionnr'))

const fylker = parsedRegions
  .distinct(region => region.Fylkenr)
  .map(pickKeys('Fylkenr', 'Fylkenavn'))
  .map(renameKeys({
    Fylkenr: 'code',
    Fylkenavn: 'name'
  }))
  .map(fylke => {
    return Object.assign({}, fylke, {
      type: 'county'
    })
  })
  .toArray()
  .flatMap(serializeTo('./data/fylker.json'))

const kommuner = parsedRegions
  .distinct(region => region.Kommunenr)
  .map(pickKeys('Kommunenr', 'Kommunenavn', 'Fylkenr', 'IMDiRegion', 'Næringsregionnr', 'Sentralitet_nr_2008', 'Sentralitet_kat_2008'))
  .map(renameKeys({
    Kommunenr: 'code',
    Kommunenavn: 'name',
    Fylkenr: 'countyCode',
    IMDiRegion: 'imdiRegion',
    Næringsregionnr: 'commerceRegionCode',
    /* eslint-disable camelcase */
    Sentralitet_nr_2008: 'centralityNumber',
    Sentralitet_kat_2008: 'centralityName'
    /* eslint-enable camelcase */
  }))
  .map(kommune => {
    return Object.assign({}, kommune, {
      name: kommune.name === 'Oslo kommune' ? 'Oslo' : kommune.name,
      type: 'municipality'
    })
  })
  .toArray()
  .flatMap(serializeTo('./data/kommuner.json'))

const naeringsregioner = parsedRegions
  .distinct(region => region['Næringsregionnr'])
  .map(pickKeys('Næringsregionnr', 'Næringsregion_ navn', 'Kommunenr'))
  .map(renameKeys({
    Næringsregionnr: 'code',
    'Næringsregion_ navn': 'name',
    Kommunenr: 'municipalityCode'
  }))
  .map(naeringsregion => {
    return Object.assign({}, naeringsregion, {
      type: 'commerceRegion'
    })
  })
  .toArray()
  .flatMap(serializeTo('./data/naeringsregioner.json'))

const bydeler = csvToObjects(CSV_FILE_KOMMUNER_BYDELER)
  .distinct(region => region.bydelsnr)
  .map(padKeys('0', 6, 'bydelsnr'))
  .map(pickKeys('bydelsnr', 'bydelsnavn', 'Kommunenr'))
  .map(renameKeys({
    bydelsnr: 'code',
    bydelsnavn: 'name',
    Kommunenr: 'municipalityCode'
  }))
  .map(bydel => {
    return Object.assign({}, bydel, {
      type: 'borough'
    })
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

function padKeys(padding, len, ...keys) {
  return function (object) {
    const padded = keys.reduce((acc, key) => {
      assert(object[key], `Missing key ${key} in ${JSON.stringify(object)}`)
      acc[key] = leftPad(object[key], padding, len)
      return acc
    }, {})
    return Object.assign({}, object, padded)
  }
}

function serializeTo(file) {
  return function serialize(entries) {
    return writeFile(file, JSON.stringify(entries, null, 2)).then(() => {
      return {file, entries}
    })
  }
}
