import {NAVIGATE} from './ActionTypes'

export function navigate(PageComponent, match = {}) {
  return dispatch => {
    dispatch({
      type: NAVIGATE,
      PageComponent,
      match
    })
  }
}
