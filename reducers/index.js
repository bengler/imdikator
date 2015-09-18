import {combineReducers} from 'redux'
//import {RECEIVE_CARD_PAGE_DATA} from '../actions/cardPages'
import route from './route'
//import cards from './cards'
import region from './region'
import cardPage from './cardPage'
import openCards from './openCards'
import queryResult from './cards'
import queries from './queries'
import tables from './table'

export default combineReducers({
  route,
  region,
  cardPage,
  openCards,
  //activeTabName(state = null, action) {
  //  if (action.type == RECEIVE_CARD_PAGE_DATA) {
  //    return action.activeTabName
  //  }
  //  return state
  //},
  queries,
  queryResult,
  tables
})
