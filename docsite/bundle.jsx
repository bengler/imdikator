import 'babelify/polyfill'
import React from 'react'
import Router from '../lib/Router'
import compileRoutes from '../lib/compileRoutes'
import Index from './components/Index'
import registry from './registry'
import routeComponentInGroup from './utils/routeComponentInGroup'

const componentRoutes = registry.reduce((routes, group) => {
  group.components.forEach(component => {
    routes[routeComponentInGroup(component, group)] = component
  })
  return routes
}, {})


const routeMappings = {
  '/docs': Index,
  ...componentRoutes
}

const routes = compileRoutes(routeMappings)

const container = document.getElementById('main')
const router = Router(routes, match => {
  const Component = match.handler
  React.render(<Component registry={registry}/>, container)
})

router.start()
