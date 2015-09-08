import Qs from 'qs'
export default function Router(routes, callback) {

  return {
    navigate,
    start,
    makeLink
  }

  function makeLink(route, params, queryFn) {
    const locationMatch = routes.match(document.location.href)
    const routeMatch = routes.match(route)

    const requiredParams = routeMatch.route
      .split('/')
      .map(segment => segment.startsWith(':') && segment.substring(1))
      .filter(Boolean)

    if (locationMatch.route !== routeMatch.route) {
      requiredParams.forEach(param => {
        if (!params[param]) {
          throw new Error(`A value for param "${param}" is required when creating link to ${routeMatch.route}"`)
        }
      })
    }

    const mergedParams = Object.assign({}, locationMatch.params, params)

    const newPath = routeMatch.url.split('?')[0].split('/').map(segment => {
      if (!segment.startsWith(':')) {
        return segment
      }
      const paramName = segment.substring(1)
      if (!requiredParams.includes(paramName)) {
        throw new Error(`Invalid param "${paramName}" in ${route}. The given route should be "${routeMatch.route}"`)
      }
      return mergedParams[paramName]
    }).join('/')

    const query = queryFn ? queryFn(locationMatch.query) : locationMatch.query

    return newPath + (query ? '?' + Qs.stringify(query) : '')
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
