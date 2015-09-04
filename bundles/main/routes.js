import RegionPage from '../../components/pages/RegionPage'
import IndexPage from '../../components/pages/IndexPage'
import NotFoundPage from '../../components/pages/NotFoundPage'
import ChartsPage from '../../components/pages/ChartsPage'
import GroupPage from '../../components/pages/GroupPage'

export default {
  '/': IndexPage,
  '/debug/charts/': ChartsPage,
  '/debug/charts/:chart': ChartsPage,
  '/regions/:region/:group/:cardName': GroupPage,
  '/regions/:region': RegionPage,
  '*': NotFoundPage
}
