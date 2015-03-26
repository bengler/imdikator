const Bluebird = require('bluebird');
const fs = require('fs');
const {pick, range} = require('lodash');

const request = Bluebird.promisify(require('request'));
const writeFile = Bluebird.promisify(require('fs').writeFile);


const API_URL_KOMMUNE = "http://hotell.difi.no/api/json/ssb/regioner/kommuner";
const API_URL_FYLKE = "http://hotell.difi.no/api/json/ssb/regioner/fylke";

const OUT_FILE_KOMMUNE = "./data/kommuner.json";
const OUT_FILE_FYLKE = "./data/fylker.json";

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

const fetchPage = pageFetcher(API_URL_KOMMUNE);

const fetchKommuner = fetchPage(1)
  .then(firstPage => {
    return Bluebird.map(range(2, firstPage.pages+1), fetchPage).then(pages => [firstPage, ...pages]);
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

const fetchFylke = request(API_URL_FYLKE)
    .then(([response, body]) => {
      const entries = JSON.parse(body).entries;
      return entries.map(entry => pick(entry, 'tittel', 'kode'));
    })
    .tap(entries => {
      return writeFile(OUT_FILE_FYLKE, JSON.stringify(entries, null, 2))
    })
  ;

Bluebird.join(fetchKommuner, fetchFylke)
  .then(([kommuner, fylker])=> {
    console.log(`Imported ${kommuner.length} kommuner and ${fylker.length} fylker.`);
    console.log(`Done!`);
  })
  .catch(e => {
    throw e;
  })