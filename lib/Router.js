import Qs from 'qs'
import closest from 'closest'

export default function Router(routes, callback) {

  window.addEventListener('popstate', () => {
    callbackUrl(document.location.href)
  })

  return {
    navigate,
    bind,
    makeLink
  }

  function makeLink(route, params, queryFn) {
    const locationMatch = routes.match(document.location.href)
    const routeMatch = routes.match(route)

    const requiredParams = routeMatch.route
      .split('/')
      .map(segment => segment.startsWith(':') && segment.substring(1))
      .filter(Boolean)

    const mergedParams = Object.assign({}, locationMatch.params, params)

    if (locationMatch.route !== routeMatch.route) {
      requiredParams.forEach(param => {
        if (typeof mergedParams[param] == 'undefined') {
          throw new Error(`A value for param "${param}" is required when creating link to ${routeMatch.route}"`)
        }
      })
    }

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

    return newPath + (Object.keys(query).length > 0 ? `?${Qs.stringify(query)}` : '')
  }

  function callbackUrl(url) {
    callback(routes.match(url))
  }

  function navigate(url, options = {}) {
    if (url === document.location.href) {
      return
    }
    if (options.replace) {
      window.history.replaceState(null, {}, url)
    } else {
      window.history.pushState(null, {}, url)
    }
    if (!options.keepScrollPosition) {
      window.scrollTo(0, 0)
    }
    callbackUrl(url)
  }

  function bind(element) {
    element.addEventListener('click', event => {
      const {target} = event

      const targetAnchor = isAnchor(target) ? target : closest(target, 'a')

      if (!targetAnchor) {
        return
      }

      if (hasHref(targetAnchor) && isRegistered(targetAnchor.href) && isInternal(targetAnchor)) {
        event.preventDefault()
        const replace = targetAnchor.getAttribute('data-history-replace') === 'true'
        const keepScrollPosition = targetAnchor.getAttribute('data-keep-scroll-position') === 'true'
        navigate(targetAnchor.href, {keepScrollPosition: keepScrollPosition, replace: replace})
      }

      function isAnchor(el) {
        return el.tagName.toLowerCase() === 'a'
      }

      function hasHref(el) {
        return el.hasAttribute('href')
      }

      function isInternal(anchor) {
        return anchor.host === document.location.host
      }

      function isRegistered(url) {
        return routes.has(url)
      }
    })
  }
}
