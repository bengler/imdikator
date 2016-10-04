// import {LOADING_START, LOADING_FINISH} from '../actions/ActionTypes'

// export default function cards(state = {isLoading: false}, action) {
//   switch (action.type) {
//     case LOADING_START:
//       return Object.assign({}, state, {
//         isLoading: true,
//       })
//     case LOADING_FINISH:
//       return Object.assign({}, state, {
//         isLoading: false,
//       })
//     default:
//       return state
//   }
// }

import {SHOW_OVERLAY, REQUEST_CARD_QUERY_RESULT, RECEIVE_CARD_QUERY_RESULT} from '../actions/ActionTypes'

export default function cards(state = {}, action) {
  switch (action.type) {
    case SHOW_OVERLAY:
      return Object.assign({}, state, {
        isLoading: true,
      })
    case REQUEST_CARD_QUERY_RESULT:
      return Object.assign({}, state, {
        count: state.count + 1,
      })
    case RECEIVE_CARD_QUERY_RESULT:
      return Object.assign({}, state, {
        count: state.count - 1,
        isLoading: state.count > 0 && state.isLoading,
      })
    default:
      return state
  }
}
