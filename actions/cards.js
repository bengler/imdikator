import {OPEN_CARD, CLOSE_CARD} from './ActionTypes'


export function openCard(cardName) {
  return dispatch => {
    dispatch({
      type: OPEN_CARD,
      cardName
    })
  }
}

export function closeCard(cardName) {
  return dispatch => {
    dispatch({
      type: CLOSE_CARD,
      cardName
    })
  }
}
