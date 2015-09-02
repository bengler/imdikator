import React, {PropTypes, addons} from 'react/addons'
import PropForm from './PropForm'

function attibutize(value) {
  if (typeof value === 'object') {
    return `{${JSON.stringify(value)}}`
  }
  if (typeof value === 'number') {
    return `{${value}}`
  }
  if (typeof value === 'string') {
    return `"${value}"`
  }
  if (typeof value === 'function') {
    return `{${value}}`
  }
}

function toAttrs(props) {
  return Object.keys(props)
    .map(prop => {
      const value = props[prop]
      if (value == void 0) {
        return value
      }
      return `${prop}=${attibutize(value)}`
    })
    .filter(Boolean)
    .join(' ')
}

export default class Tester extends React.Component {
  static propTypes = {
    component: PropTypes.func.isRequired
  }

  constructor() {
    super()
    this.state = {
      props: {}
    }
  }

  handlePropChange(prop, newValue) {
    this.setState({
      props: addons.update(this.state.props, {
        [prop.name]: {$set: newValue}
      })
    })
  }

  renderPropTypes() {
    const Component = this.props.component
    const componentProps = this.state.props

    if (!Component.doc) {
      return <span>No doc found for {Component.name}. Please make sure the redocify browserify transform is loaded</span>
    }
    if (!Component.doc.props) {
      return <span>No propTypes defined on {Component.name}.</span>
    }
    return (
      <div>
        <PropForm propTypes={Component.doc.props} propValues={componentProps} onPropChange={this.handlePropChange.bind(this)}/>}
        <h2>Result</h2>
        <pre>{`<${Component.name} ${toAttrs(componentProps)}/>`}</pre>
      </div>
    )
  }

  render() {
    const Component = this.props.component
    const {description} = Component.doc
    const componentProps = this.state.props

    return (
      <div>
        <a href="/docs">« Back</a>

        <h1>Component {Component.name}</h1>

        <p>{description}</p>

        <h2>PropTypes</h2>
        {this.renderPropTypes()}
        <Component {...componentProps}/>
      </div>
    )
  }
}
