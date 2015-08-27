import HttpHash from 'http-hash'
import Url from 'url'
import Qs from 'qs'

export default function compileRoutes(routes) {
  const hash = HttpHash()

  // Get a valid route
  Object.keys(routes).forEach(path => {
    hash.set(path, routes[path])
  })

  return {
    match(url) {

      const parsed = Url.parse(url, false)

      const qs = Qs.parse(parsed.query)

      const match = hash.get(parsed.pathname)
      if (!match.handler) {
        return null
      }

      return {
        params: match.params,
        query: qs,
        splat: match.splat,
        route: match.src,
        hash: parsed.hash,
        url: parsed.path + (parsed.hash || ''),
        handler: match.handler
      }
    },
    has(url) {
      const parsed = Url.parse(url, false)
      return hash.get(parsed.pathname).handler
    }
  }
}

