import RegionPage from '../../components/pages/RegionPage'
import SimilarRegionsPage from '../../components/pages/SimilarRegionsPage'
import IndexPage from '../../components/pages/IndexPage'
import NotFoundPage from '../../components/pages/NotFoundPage'
import CardsPage from '../../components/pages/CardsPage'
import FactsPage from '../../components/pages/FactsPage'

import {setCurrentRegionByCode} from '../../actions/region'
import {loadCardsPage, openCard} from '../../actions/cardsPage'
import {loadFactsPageData} from '../../actions/factsPage'

//import ChartsPage from '../../components/pages/ChartsPage'
//import RenderTestPage from '../../components/testbed/RenderTestPage'

const routes = routeBuilder()

routes.add('/', () => IndexPage)

routes.add('/steder/:region', (dispatch, match) => {
  dispatch(setCurrentRegionByCode(match.params.region))
  return RegionPage
})

routes.add('/steder/:region/lignende', (dispatch, match) => {
  dispatch(setCurrentRegionByCode(match.params.region))
  return SimilarRegionsPage
})

routes.add('/steder/:region/fakta', (dispatch, match) => {
  dispatch(loadFactsPageData(match.params.region))
  return FactsPage
})

routes.add('/steder/:region/:cardsPageName', (dispatch, match) => {
  const {params} = match
  dispatch(loadCardsPage(params.region, params.cardsPageName))
  return CardsPage
})

routes.add('/steder/:region/:cardsPageName/:cardName', (dispatch, match) => {
  const {params} = match
  dispatch(
    loadCardsPage(params.region, params.cardsPageName, {
      cardName: params.cardName
    })
  )
  dispatch(openCard(params.cardName))
  return CardsPage
})

routes.add('/steder/:region/:cardsPageName/:cardName/:tabName', (dispatch, match) => {
  const {params} = match
  dispatch(
    loadCardsPage(params.region, params.cardsPageName, {
      cardName: params.cardName,
      tabName: params.tabName
    })
  )
  dispatch(openCard(params.cardName))
  return CardsPage
})

routes.add('*', (dispatch, route) => {
  return NotFoundPage
})

//routes.add('/debug/render/', (dispatch, route) => {
//  return ChartsPage
//})
//
//routes.add('/debug/charts/', (dispatch, route) => {
//  return ChartsPage
//})
//
//routes.add('/debug/charts/:chart', (dispatch, route) => {
//  return ChartsPage
//})

export default routes.build()

function routeBuilder() {
  const _routes = {}
  return {
    add(route, handler) {
      _routes[route] = handler
      return this
    },
    build() {
      return _routes
    }
  }
}
