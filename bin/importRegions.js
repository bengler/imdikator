const Bluebird = require('bluebird');
const fs = require('fs');
const {pick, range} = require('lodash');

const request = Bluebird.promisify(require('request'));
const writeFile = Bluebird.promisify(require('fs').writeFile);


const API_URL_KOMMUNE = "http://hotell.difi.no/api/json/ssb/regioner/kommuner";
const API_URL_FYLKE = "http://hotell.difi.no/api/json/ssb/regioner/fylke";
const API_URL_BYDEL = "http://hotell.difi.no/api/json/ssb/regioner/bydel";

const OUT_FILE_KOMMUNE = "./data/kommuner.json";
const OUT_FILE_FYLKE = "./data/fylker.json";
const OUT_FILE_BYDEL = "./data/bydeler.json";

function pageFetcher(url) {
  return function fetchPage(page) {
    return request(`${url}?page=${page}`).then(([response, body])=> {
      if (response.statusCode < 200 || response.statusCode > 299) {
        return Bluebird.reject(new Error(`HTTP Error ${response.statusCode}: ${body}`))
      }
      return JSON.parse(body)
    });
  };
}

const fetchKommunePage = pageFetcher(API_URL_KOMMUNE);

const fetchKommuner = fetchKommunePage(1)
  .then(firstPage => {
    return Bluebird.map(range(2, firstPage.pages+1), fetchKommunePage).then(pages => [firstPage, ...pages]);
  })
  .then(allPages => {
    return allPages
      .map(page => page.entries)
      .map(entries => entries.map(entry => pick(entry, 'tittel', 'kode')))
      .reduce((acc, entries) => acc.concat(entries), [])
  })
  .tap(entries => {
    return writeFile(OUT_FILE_KOMMUNE, JSON.stringify(entries, null, 2))
  });


const fetchBydelPage = pageFetcher(API_URL_BYDEL);

const fetchBydeler = fetchBydelPage(1)
  .then(firstPage => {
    return Bluebird.map(range(2, firstPage.pages+1), fetchBydelPage).then(pages => [firstPage, ...pages]);
  })
  .then(allPages => {
    return allPages
      .map(page => page.entries)
      .map(entries => entries.map(entry => pick(entry, 'tittel', 'kode')))
      .reduce((acc, entries) => acc.concat(entries), [])
  })
  .tap(entries => {
    return writeFile(OUT_FILE_BYDEL, JSON.stringify(entries, null, 2))
  });

const fetchFylke = request(API_URL_FYLKE)
    .then(([response, body]) => {
      const entries = JSON.parse(body).entries;
      return entries.map(entry => pick(entry, 'tittel', 'kode'));
    })
    .tap(entries => {
      return writeFile(OUT_FILE_FYLKE, JSON.stringify(entries, null, 2))
    });

Bluebird
  .join(fetchKommuner, fetchFylke, fetchBydeler)
  .then(([kommuner, fylker, bydeler])=> {
    console.log(`Done!`);
    console.log(`  Imported ${fylker.length} fylker.`);
    console.log(`  Imported ${kommuner.length} kommuner.`);
    console.log(`  Imported ${bydeler.length} bydeler.`);
  })
  .catch(e => {
    throw e;
  });