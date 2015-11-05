import {NAVIGATE} from '../actions/ActionTypes'

export default function breadCrumbs(state = [], action) {
  switch (action.type) {
    case NAVIGATE:
      const segments = action.match.url.split('/').slice(1).filter(Boolean)
      return segments.map((segment, i) => {
        return {
          url: `/${segments.slice(0, i + 1).join('/')}`,
          title: segments[i]
        }
      })

    default:
      return state
  }
}
