import {combineReducers} from 'redux'
import currentRegion from './currentRegion'
import page from './page'
import headerGroups from './headerGroups'
import cardState from './cardState'
import route from './route'
import openCards from './openCards'
import currentCardsPage from './currentCardsPage'
import currentCard from './currentCard'
import breadCrumbs from './breadCrumbs'
import currentTab from './currentTab'
import regionSummaries from './regionSummaries'
import variableDefinitions from './variableDefinitions'

export default combineReducers({
  page: page,
  allRegions: (state = []) => state,
  allCardsPages: (state = []) => state,
  variableDefinitions,
  currentRegion,
  breadCrumbs,
  headerGroups,
  currentCardsPage,
  currentCard,
  currentTab,
  openCards,
  cardState,
  route,
  regionSummaries
})
