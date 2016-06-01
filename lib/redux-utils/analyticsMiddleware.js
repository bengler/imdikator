export default function analyticsMiddleware(track) {
  return store => next => action => {

    const returnValue = next(action) // eslint-disable-line callback-return

    if (!action) {
      return returnValue
    }

    track(action, store.getState())

    return returnValue
  }
}
