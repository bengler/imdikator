import RegionPage from '../../components/pages/RegionPage'
import IndexPage from '../../components/pages/IndexPage'
import NotFoundPage from '../../components/pages/NotFoundPage'
import ChartsPage from '../../components/pages/ChartsPage'
import CardsPage from '../../components/pages/CardsPage'

export default {
  '/': IndexPage,
  '/debug/charts/': ChartsPage,
  '/debug/charts/:chart': ChartsPage,
  '/steder/:region/:pageName': CardsPage,
  '/steder/:region/:pageName/:cardName': CardsPage,
  '/steder/:region/:pageName/:cardName/:tabName': CardsPage,
  '/steder/:region': RegionPage,
  '*': NotFoundPage
}
