import request from '../lib/http/request'
import parse from 'csv-parse'
import Promise from 'bluebird'
import _ from 'lodash'
import fs from 'fs'
import {QueryDimension} from '@bengler/imdi-dataset'

const groupsUrl = 'https://docs.google.com/a/bengler.no/spreadsheets/d/1Wm0yF_Rs6VLW9dS_nZgbJrt2ymXEiaFVKBvhUae6lRs'
const outFile = './data/groups.json'

const csvSuffix = '/export?format=csv'

// Mute all channels except debug
const SOLO = false

const importGroups = function (url) {
  url += csvSuffix
  return request.get(url).then(response => {
    return new Promise((resolve, reject) => {
      parse(response.body, {comment: '#', columns: true}, (err, output) => {
        if (err) {
          return reject(err)
        }
        resolve(output)
      })
    })
  })
}

function trim(s) {
  return s ? s.trim() : s
}

const mungeLine = function (line) {
  line = _.omit(line, entry => entry == '')

  if (line.dimensions) {
    line.dimensions = line.dimensions.split('').map(trim).filter(Boolean).map(QueryDimension.parse)
  }

  if (line.time) {
    const parsedTime = line.time.split(',').map(trim).filter(Boolean)
    if (parsedTime.length === 1 && !(/^\d+$/.test(parsedTime))) {
      line.time = parsedTime[0]
    } else {
      line.time = parsedTime
    }
  }
  return line
}

const parseGroups = function (lines) {
  let currentGroup = {}
  const groups = []
  lines.forEach(line => {
    line = mungeLine(line)
    if (line.groupKind !== void 0 && currentGroup.kind != line.groupKind) {
      if (currentGroup.groupKind !== void 0) {
        groups.push(currentGroup)
      }
      currentGroup = {
        urlName: line.chartKind,
        title: line.title,
        groupKind: line.groupKind,
        items: []
      }
    } else if (Object.keys(line).length > 0 && line.groupKind != '#') { // # in groupKind is skip notation
      if (!SOLO || (SOLO && line.debug)) {
        currentGroup.items.push(line)
      }
    }
  })
  return groups
}

/* eslint-disable no-console */
console.log('Reading components')
importGroups(groupsUrl).then(result => {
  const groupDict = parseGroups(result)
  fs.writeFile(outFile, JSON.stringify(groupDict, null, 2), function (err) {
    if (err) {
      throw err
    }
    console.log('Done!')
  })
}).catch(error => {
  console.log('Could not fetch: ' + error.stack)
})
/* eslint-enable no-console */
