export function findInTree(testFn) {
  if (testFn(this)) {
    return this
  }
  if (!this || !this.props) {
    return null
  }
  let {children} = this.props
  if (!children) {
    return null
  }

  if (!Array.isArray(children)) {
    children = [children]
  }

  let found = null
  children.some(child => {
    const _current = child::findInTree(testFn)
    if (_current) {
      found = _current
      return true
    }
  })
  return found
}

export function someInTree(testFn) {
  if (testFn(this)) {
    return true
  }
  if (!this || !this.props) {
    return false
  }
  let {children} = this.props
  if (!children) {
    return false
  }

  if (!Array.isArray(children)) {
    children = [children]
  }
  return children.some(child => {
    return child::someInTree(testFn)
  })
}
export function forEach(itFn) {
  itFn(this)
  if (!this || !this.props) {
    return
  }
  let {children} = this.props
  if (!children) {
    return
  }

  if (!Array.isArray(children)) {
    children = [children]
  }
  children.forEach(child => child::forEach(itFn))
}
