const Bluebird = require('bluebird');
const fs = require('fs');
const Rx = require('rx');
const _pick = require('lodash').pick;

const writeFile = Bluebird.promisify(fs.writeFile);
const csv = require('csv-parse');

const log = console.log.bind(console);

const CSV_FILE_FYLKER_KOMMUNER = "./import/regioninndeling-fylker-kommuner.csv";
const CSV_FILE_KOMMUNER_BYDELER = "./import/regioninndeling-kommuner-bydeler.csv";


const parsedRegions = csvToObjects(CSV_FILE_FYLKER_KOMMUNER);

const fylker = parsedRegions
  .distinct(region => region.Fylkenr)
  .map(pick('Fylkenr', 'Fylkenavn'))
  .map(renameKeys({
    Fylkenr: 'code',
    Fylkenavn: 'name'
  }))
  .toArray()
  .flatMap(serializeTo('./data/fylker.json'))

const kommuner = parsedRegions
  .distinct(region => region.Kommunenr)
  .map(pick('Kommunenr', 'Kommunenavn', 'Fylkenr', 'IMDiRegion', 'Næringsregionnr', 'Sentralitet_nr_2008', 'Sentralitet_kat_2008'))
  .map(renameKeys({
    Kommunenr: 'code',
    Kommunenavn: 'name',
    Fylkenr: 'fylkeCode',
    IMDiRegion: 'imdiRegion',
    Næringsregionnr: 'naeringsRegionCode',
    Sentralitet_nr_2008: 'centralityNumber',
    Sentralitet_kat_2008: 'centralityName'
  }))
  .map(kommune => {
    if (kommune.name === "Oslo kommune") {
      kommune.name = "Oslo"
    }
    return kommune;
  })
  .toArray()
  .flatMap(serializeTo('./data/kommuner.json'))

const naeringsregioner = parsedRegions
  .distinct(region => region['Næringsregionnr'])
  .map(pick('Næringsregionnr', 'Næringsregion_ navn'))
  .map(renameKeys({
    Næringsregionnr: 'code',
    "Næringsregion_ navn": 'name',
    Kommunenr: 'municipalityCode',
  }))
  .toArray()
  .flatMap(serializeTo('./data/naeringsregioner.json'))

const bydeler = csvToObjects(CSV_FILE_KOMMUNER_BYDELER)
  .distinct(region => region.bydelsnr)
  .map(pick('bydelsnr', 'bydelsnavn'))
  .map(renameKeys({
    bydelsnr: 'code',
    bydelsnavn: 'name',
    Kommunenr: 'kommuneCode'
  }))
  .toArray()
  .flatMap(serializeTo('./data/bydeler.json'))

naeringsregioner.subscribe(res => log("Wrote %s næringsregioner to %s", res.entries.length, res.file));
kommuner.subscribe(res => log("Wrote %s kommuner to %s", res.entries.length, res.file));
bydeler.subscribe(res => log("Wrote %s bydeler to %s", res.entries.length, res.file));
fylker.subscribe(res => log("Wrote %s fylker to %s", res.entries.length, res.file));

// A few helper functions

function csvToObjects(file) {
  const rows = Rx.Node.fromReadableStream(fs.createReadStream(file).pipe(csv()));
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

function renameKeys(keyNamesMap) {
  return function (object) {
    const knownKeyNames = Object.keys(keyNamesMap);
    return Object.keys(object).reduce((renamed, key)=> {
      if (!knownKeyNames.includes(key)) {
        throw new Error("Don't know what to rename the key '" + key + "' to");
      }
      renamed[keyNamesMap[key]] = object[key];
      return renamed;
    }, {});
  }
}

function pick(...keys) {
  return function pick(object) {
    return _pick(object, ...keys)
  }
}

function serializeTo(file) {
  return function serialize(entries) {
    return writeFile(file, JSON.stringify(entries, null, 2)).then(() => {
      return {file, entries}
    });
  }
}
