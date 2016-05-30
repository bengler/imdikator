import routeComponentInGroup from '../utils/routeComponentInGroup'
import React, {PropTypes} from 'react'

export default class Index {
  static propTypes = {
    registry: PropTypes.array
  };

  render() {
    const {registry} = this.props
    return (
      <div>
        <h2>Components documentation</h2>
        {registry.map(group => {
          return (
            <div key={group.name}>
              <h3>{group.name}</h3>
              <ul>
                {group.components.map(Component => {
                  return (
                    <li key={Component.name}><a href={routeComponentInGroup(Component, group)}>{Component.name || Component.displayName}</a></li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    )
  }
}
