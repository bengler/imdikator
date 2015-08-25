export default function Router(routes, dispatch) {

  return {
    navigate,
    start
  }

  function dispatchUrl(url) {
    dispatch(routes.match(url))
  }


  function navigate(url, replace = false) {
    if (url === document.location.href) {
      return
    }
    if (replace) {
      window.history.replaceState(null, {}, url)
    } else {
      window.history.pushState(null, {}, url)
    }
    dispatchUrl(url)
  }

  function start() {
    window.addEventListener('popstate', () => {
      dispatchUrl(document.location.href)
    })

    document.body.addEventListener('click', event => {
      const {target} = event

      if (isAnchor(target) && isRegistered(target.href) && isInternal(target)) {
        event.preventDefault()
        const replace = target.getAttribute('data-history-replace') === 'true'
        navigate(target.href, replace)
      }

      function isAnchor(element) {
        return element.tagName.toLowerCase() === 'a'
      }

      function isInternal(anchor) {
        return anchor.host === document.location.host
      }

      function isRegistered(url) {
        return routes.has(url)
      }
    })
    // Dispatch initially
    dispatchUrl(document.location.href)
  }
}
