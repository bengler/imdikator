import dasherize from 'dasherize'

export default function routeComponentInGroup(component, group) {
  return `/docs/${group.name}/${dasherize(component.displayName || component.name)}`
}
