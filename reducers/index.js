import {combineReducers} from 'redux'
import route from './route'
import region from './region'
import tableHeaders from './tableHeaders'
import cardState from './cardState'
import openCards from './openCards'
import cardPage from './cardPage'

export default combineReducers({
  route,
  region,
  cardPage,
  tableHeaders,
  cardState,
  openCards
})
