import React, {PropTypes} from 'react/addons'

const valueParsers = {
  string: val => val.trim() ? val : void 0,
  func: val => val.trim() ? Function(val) : void 0, // eslint-disable-line no-new-func
  number: val => val.trim() ? Number(val) : void 0,
  object: val => val.trim() ? JSON.parse(val) : void 0
}

// Builds a form based on React.PropTypes
export default class PropForm extends React.Component {
  static propTypes = {
    propTypes: PropTypes.object,
    propValues: PropTypes.object,
    onPropChange: PropTypes.func
  }

  emitPropValueChange(prop) {
    return event => {
      const {onPropChange} = this.props
      if (onPropChange) {
        onPropChange(prop, valueParsers[prop.type.name](event.target.value))
      }
    }
  }

  renderInput(prop) {
    const {propValues} = this.props
    switch (prop.type.name) {
      case 'string':
        return (
          <div>
            <input type="text" value={propValues[prop.name]} onChange={this.emitPropValueChange(prop)}/>
            {prop.defaultValue && <span>(Default: {prop.defaultValue.value})</span>}
          </div>
        )
      case 'number':
        return (
          <div>
            <input type="number" value={propValues[prop.name]} onChange={this.emitPropValueChange(prop)}/>
            {prop.defaultValue && <span>(Default: {prop.defaultValue.value})</span>}
          </div>

        )
      case 'object':
        return (
          <div>
            <textarea type="text" value={JSON.stringify(propValues[prop.name])} onChange={this.emitPropValueChange(prop)}/>
            {prop.defaultValue && <span>(Default: {prop.defaultValue.value})</span>}
          </div>

        )
      case 'func':
        const value = propValues[prop.name]
        const fn = value && value.toString()
        const body = (fn ? fn.substring(fn.indexOf('{') + 1, fn.lastIndexOf('}')) : '')
          .replace(/^\s?\n?/, '')
          .replace(/\n$/, '')

        return (
          <div>
            <pre>{'function() {'}</pre>
            <textarea value={body} onChange={this.emitPropValueChange(prop)}/>
            <pre>}</pre>
            {prop.defaultValue && <span>(Default: {prop.defaultValue.value.toString()})</span>}
          </div>
        )
      default:
        return <div>No registered editor for {prop.type.name}. Debug: <pre>{JSON.stringify(prop, null, 2)}</pre></div>
    }
  }

  getProps() {
    const {propTypes} = this.props
    return Object.keys(propTypes).map(propName => {
      return Object.assign({name: propName}, propTypes[propName])
    })
  }

  renderFieldForProp(prop) {
    return (
      <div>
        <h3>{prop.name} (<em>{prop.type.name}</em>)</h3>
        <div><em>{prop.description}</em></div>
        {this.renderInput(prop)}
      </div>
    )
  }

  render() {
    return (
      <div>
          {this.getProps().map(prop => {
            return <div>{this.renderFieldForProp(prop)}</div>
          })}
      </div>
    )
  }
}
