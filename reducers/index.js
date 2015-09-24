import {combineReducers} from 'redux'
import route from './route'
import allRegions from './allRegions'
import region from './region'
import headerGroups from './headerGroups'
import cardState from './cardState'
import openCards from './openCards'
import cardPage from './cardPage'
import cardPages from './cardPages'

export default combineReducers({
  route,
  allRegions,
  region,
  cardPage,
  cardPages,
  headerGroups,
  cardState,
  openCards
})
