import React, {PropTypes, addons} from 'react/addons'
import PropForm from './PropForm'

function attributize(value) {
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
      return `${prop}=${attributize(value)}`
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
      return (
        <span>No doc found for {Component.name}. Please make sure the redocify browserify transform is loaded</span>
      )
    }
    if (!Component.doc.props) {
      return <span>No propTypes defined on {Component.name}.</span>
    }
    return (<PropForm propTypes={Component.doc.props} propValues={componentProps}
                      onPropChange={this.handlePropChange.bind(this)}/>)
  }

  renderUsage() {
    const Component = this.props.component
    const componentProps = this.state.props

    if (!Component.doc) {
      return (
        <span>No doc found for {Component.name}. Please make sure the redocify browserify transform is loaded</span>
      )
    }
    return (
      <pre>{`<${Component.name} ${toAttrs(componentProps)}/>`}</pre>
    )
  }

  render() {
    const Component = this.props.component
    const componentProps = this.state.props

    return (
      <main className="page">
        <div className="page__content">
          <div className="wrapper">
            <div className="row">
              <a href="/docs">« Back</a>
            </div>
            <div className="row">
              <div className="col--main">
                <h1>{Component.name}</h1>

                <p><span>{Component.doc.description}</span></p>

                <h3>PropTypes</h3>
                <p>
                {this.renderPropTypes()}
                </p>

                <h3>Usage</h3>
                <p>
                  {this.renderUsage()}
                </p>

                <h3 className="feature-small__title">Live example</h3>
                <p className="feature-small__meta">
                  <Component {...componentProps}/>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}
