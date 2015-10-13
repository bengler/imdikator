import RegionPage from '../../components/pages/RegionPage'
import SimilarRegionsPage from '../../components/pages/SimilarRegionsPage'
import IndexPage from '../../components/pages/IndexPage'
import NotFoundPage from '../../components/pages/NotFoundPage'
import ChartsPage from '../../components/pages/ChartsPage'
import CardsPage from '../../components/pages/CardsPage'
import TestRegionSelect from '../../components/testbed/TestRegionSelect'

export default {
  '/': IndexPage,
  '/debug/charts/': ChartsPage,
  '/debug/charts/:chart': ChartsPage,
  '/debug/region-select': TestRegionSelect,
  '/steder/:region': RegionPage,
  '/steder/:region/ligner': SimilarRegionsPage,
  '/steder/:region/:pageName': CardsPage,
  '/steder/:region/:pageName/:cardName': CardsPage,
  '/steder/:region/:pageName/:cardName/:tabName': CardsPage,
  '*': NotFoundPage
}
