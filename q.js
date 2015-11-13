/* eslint-disable */

import cardPages from './data/cardPages'
import {TABS} from'./config/tabs'
import path from 'path'
import fs from 'fs'

const result = cardPages.map(cardPage => {
  return Object.assign({}, cardPage, {
    cards: cardPage.cards.map(card => {
      const {name, title, query, tabs, config, ...rest} = card
      return {
        name,
        title,
        config,
        query,
        tabs,
        ...rest
      }
    })
  })
})
fs.writeFileSync(path.join(__dirname, '/data/cardPages.json'), JSON.stringify(result, null, 2))
