import RegionPage from '../../components/pages/RegionPage'
import IndexPage from '../../components/pages/IndexPage'
import NotFoundPage from '../../components/pages/NotFoundPage'
import ChartsPage from '../../components/pages/ChartsPage'
import CardsPage from '../../components/pages/CardsPage'

export default {
  '/': IndexPage,
  '/debug/charts/': ChartsPage,
  '/debug/charts/:chart': ChartsPage,
  '/regions/:region/:pageName/:cardName': CardsPage,
  '/regions/:region': RegionPage,
  '*': NotFoundPage
}
