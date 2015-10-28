import {combineReducers} from 'redux'
import route from './route'
import allRegions from './allRegions'
import region from './region'
import headerGroups from './headerGroups'
import cardState from './cardState'
import openCards from './openCards'
import cardPageData from './cardPageData'
import cardPagesData from './cardPagesData'
import cardPages from './cardPages'
import chartData from './chartFodder'

export default combineReducers({
  route,
  allRegions,
  region,
  cardPageData,
  cardPagesData,
  cardPages,
  headerGroups,
  cardState,
  openCards,
  chartData
})
