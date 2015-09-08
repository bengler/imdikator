export default function Router(routes, callback) {

  return {
    navigate,
    start
  }

  function callbackUrl(url) {
    callback(routes.match(url))
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
    callbackUrl(url)
  }

  function start() {
    window.addEventListener('popstate', () => {
      callbackUrl(document.location.href)
    })

    document.body.addEventListener('click', event => {
      const {target} = event

      if (isAnchorWithHref(target) && isRegistered(target.href) && isInternal(target)) {
        event.preventDefault()
        const replace = target.getAttribute('data-history-replace') === 'true'
        navigate(target.href, replace)
      }

      function isAnchorWithHref(element) {
        return element.tagName.toLowerCase() === 'a' && element.hasAttribute('href')
      }

      function isInternal(anchor) {
        return anchor.host === document.location.host
      }

      function isRegistered(url) {
        return routes.has(url)
      }
    })
    // Dispatch initially
    callbackUrl(document.location.href)
  }
}
