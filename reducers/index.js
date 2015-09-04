import {combineReducers} from 'redux'
export default combineReducers({
  route: require('./route'),
  region: require('./region'),
  group: require('./group'),
  currentCard: require('./currentCard')
})

