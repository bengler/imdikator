import React, {PropTypes} from 'react'

const valueParsers = {
  string: val => val.trim() ? val : void 0,
  bool: val => val.trim() == 'true',
  func: val => val.trim() ? Function(`return ${val}`)() : void 0, // eslint-disable-line no-new-func
  number: val => val.trim() ? Number(val) : void 0,
  object: val => val.trim() ? JSON.parse(val) : void 0,
  any: val => valueParsers.object(val),
  shape: val => valueParsers.object(val),
  arrayOf: val => valueParsers.object(val)
}
const checkShouldParse = {
  string: val => true,
  bool: val => val.trim() == 'true' || val.trim() == 'false',
  func: val => {
    try {
      Function(`return ${val}`)() // eslint-disable-line no-new-func
      return true
    } catch (e) {
      return false
    }
  },
  shape: val => true,
  number: val => true,
  array: val => checkShouldParse.object(val),
  arrayOf: val => checkShouldParse.object(val),
  any: val => checkShouldParse.object(val),
  object: val => {
    try {
      JSON.parse(val)
      return true
    } catch (e) {
      return false
    }
  }
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
      const shouldParse = checkShouldParse[prop.type.name]
      const parser = valueParsers[prop.type.name] || JSON.parse
      if (onPropChange) {
        const value = event.target.value
        onPropChange(prop, shouldParse(value) ? parser(value) : value)
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
      case 'bool':
        return (
          <div>
            <select value={propValues[prop.name] || false} onChange={this.emitPropValueChange(prop)}>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
            <span>(Default: false)</span>
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
        return (
          <div>
            <textarea value={fn} onChange={this.emitPropValueChange(prop)}/>
            {prop.defaultValue && <span>(Default: {prop.defaultValue.value.toString()})</span>}
          </div>
        )
      default:
        return (
          <div>
            <input type="text" value={value} onChange={this.emitPropValueChange(prop)}/>
            {prop.defaultValue && <span>(Default: {prop.defaultValue.value})</span>}
          </div>

        )
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
            return <div key={prop.name}>{this.renderFieldForProp(prop)}</div>
          })}
      </div>
    )
  }
}
