import RegionPage from '../../components/pages/RegionPage'
import IndexPage from '../../components/pages/IndexPage'
import NotFoundPage from '../../components/pages/NotFoundPage'
import ChartsPage from '../../components/pages/ChartsPage'
import RunePage from '../../components/pages/RunePage'

export default {
  '/': IndexPage,
  '/debug/charts/': ChartsPage,
  '/debug/charts/:chart': ChartsPage,
  '/regions/:region': RegionPage,
  '/rune': RunePage,
  '*': NotFoundPage
}
