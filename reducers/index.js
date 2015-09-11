import {combineReducers} from 'redux'
import route from './route'
//import cards from './cards'
import region from './region'
import cardPage from './cardPage'
import openCards from './openCards'
import queryResult from './cards'
import tables from './table'

export default combineReducers({
  route,
  region,
  cardPage,
  openCards,
  queryResult,
  tables
})
