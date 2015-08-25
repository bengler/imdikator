import RegionPage from '../../components/pages/RegionPage'
import IndexPage from '../../components/pages/IndexPage'
import NotFoundPage from '../../components/pages/NotFoundPage'

export default {
  '/': IndexPage,
  '/regions/:region': RegionPage,
  '*': NotFoundPage
}
