import 'babel-polyfill'
import loadScript from 'load-script'
import url from 'url'
import domready from 'domready'

import {API_GLOBAL, SELECTOR_EMBED, SELECTOR_SITE} from './constants'

const scriptEl = document.getElementById('imdikator-loader')

let loaded = false
function scan() {
  if (loaded) {
    return
  }

  if (!scriptEl) {
    throw new Error('The imdikator loader was included on page, but the script tag is missing required attribute id="imdikator-loader"')
  }

  const hasEmbed = document.querySelector(SELECTOR_EMBED)
  const hasSite = document.querySelector(SELECTOR_SITE)

  if (!hasEmbed && !hasSite) {
    // Nothing to do here
    return
  }

  if (hasEmbed && hasSite) {
    throw new Error('Having both embeds and the full imdikator site on the same page is not supported')
  }

  const scriptFile = url.resolve(scriptEl.src, hasEmbed ? 'embeds.js' : 'site.js')

  loaded = true
  loadScript(scriptFile, err => {
    if (err) {
      console.error(`Could not load ${scriptFile}: ${err.stack}`) // eslint-disable-line no-console
      loaded = false
    }
  })
}

const apiHost = scriptEl.getAttribute('data-api-host')

if (!apiHost) {
  throw new Error('Required attribute data-api-host not specified on element script#imdikator-loader')
}


if (API_GLOBAL in window) {
  throw new Error('Multiple instances of imdikator loaded in page')
}


const API = {
  scan: scan,
  apiHost: scriptEl.getAttribute('data-api-host')
}


window[API_GLOBAL] = API

domready(scan)
scan()
