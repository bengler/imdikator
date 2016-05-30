import React, {PropTypes} from 'react'
import update from 'react-addons-update'
import PropForm from './PropForm'

function attributize(value) {
  if (Array.isArray(value) || typeof value === 'object') {
    return `{${JSON.stringify(value)}}`
  }
  if (typeof value === 'number') {
    return `{${value}}`
  }
  if (typeof value === 'boolean') {
    return `{${value}}`
  }
  if (typeof value === 'string') {
    return `"${value}"`
  }
  if (typeof value === 'function') {
    return `{${value}}`
  }
  return ''
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

export default class ShowComponentDoc extends React.Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    componentProps: PropTypes.any
  };

  constructor(props) {
    super()
    this.state = {
      props: Object.assign({}, props.componentProps || {})
    }
  }

  handlePropChange(prop, newValue) {
    this.setState({
      props: update(this.state.props, {
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
    return (
      <PropForm propTypes={Component.doc.props} propValues={componentProps}
        onPropChange={this.handlePropChange.bind(this)}
      />
    )
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

                <div><span>{Component.doc.description}</span></div>

                <h3>PropTypes</h3>
                <div>
                {this.renderPropTypes()}
                </div>

                <h3>Usage</h3>
                <div>
                  {this.renderUsage()}
                </div>

                <h3 className="feature-small__title">Live example</h3>
                <div className="feature-small__meta">
                  <Component {...componentProps} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}
