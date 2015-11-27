import RegionPage from '../../components/pages/RegionPage'
import SimilarRegionsPage from '../../components/pages/SimilarRegionsPage'
import NotFoundPage from '../../components/pages/NotFoundPage'
import CardsPage from '../../components/pages/CardsPage'
import FactsPage from '../../components/pages/FactsPage'
import UrlQuery from '../../lib/UrlQuery'

import {setCurrentRegionByCode} from '../../actions/region'
import {loadCardsPage, openCard} from '../../actions/cardsPage'
import {loadFactsPageData} from '../../actions/factsPage'

//import ChartsPage from '../../components/pages/ChartsPage'
//import RenderTestPage from '../../components/testbed/RenderTestPage'

const routes = routeBuilder()

routes.add('/tall-og-statistikk/', (dispatch, match) => {
  dispatch(setCurrentRegionByCode('F00'))
  return RegionPage
})

routes.add('/tall-og-statistikk/steder/:region', (dispatch, match) => {
  dispatch(setCurrentRegionByCode(match.params.region))
  return RegionPage
})

routes.add('/tall-og-statistikk/steder/:region/lignende', (dispatch, match) => {
  dispatch(setCurrentRegionByCode(match.params.region))
  return SimilarRegionsPage
})

routes.add('/tall-og-statistikk/steder/:region/fakta', (dispatch, match) => {
  dispatch(loadFactsPageData(match.params.region))
  return FactsPage
})

routes.add('/tall-og-statistikk/steder/:region/:cardsPageName', (dispatch, match) => {
  const {params} = match
  dispatch(loadCardsPage(params.region, params.cardsPageName))
  return CardsPage
})

routes.add('/tall-og-statistikk/steder/:region/:cardsPageName/:cardName', (dispatch, match) => {
  const {params} = match
  dispatch(
    loadCardsPage(params.region, params.cardsPageName, {
      cardName: params.cardName
    })
  )
  dispatch(openCard(params.cardName))
  return CardsPage
})

routes.add('/tall-og-statistikk/steder/:region/:cardsPageName/:cardName/:tabName', (dispatch, match) => {
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

routes.add('/tall-og-statistikk/steder/:region/:cardsPageName/:cardName/:tabName/:query', (dispatch, match) => {
  const {params} = match

  let query = null
  if (params.query) {
    try {
      query = UrlQuery.parse(params.query.substring(1 /* strip @ */))
    } catch (error) {
      console.error('Unable to parse query: %s', error.message) // eslint-disable-line no-console
    }
  }

  dispatch(
    loadCardsPage(params.region, params.cardsPageName, {
      cardName: params.cardName,
      tabName: params.tabName,
      query: query
    })
  )
  dispatch(openCard(params.cardName))
  return CardsPage
})

routes.add('/tall-og-statistikk/*', (dispatch, route) => {
  return NotFoundPage
})

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
