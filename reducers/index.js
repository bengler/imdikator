import {combineReducers} from 'redux'
import route from './route'
import region from './region'
import currentCard from './currentCard'
import sampleData from './sampleData'
import group from './group'

export default combineReducers({
  route,
  region,
  group,
  currentCard,
  sampleData
})
