export function findInShallowRenderTree(renderOutput, testFn) {
  if (testFn(renderOutput)) {
    return renderOutput
  }
  if (!renderOutput.props) {
    return null
  }
  let {children} = renderOutput.props
  if (!children) {
    return null
  }

  if (!Array.isArray(children)) {
    children = [children]
  }

  let found = null
  children.some(child => {
    const _current = findInShallowRenderTree(child, testFn)
    if (_current) {
      found = _current
      return true
    }
  })
  return found
}
