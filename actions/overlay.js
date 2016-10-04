import {SHOW_OVERLAY} from './ActionTypes'


export function showOverlay() {
  return dispatch => {
    dispatch({
      type: SHOW_OVERLAY
    })
  }
}
