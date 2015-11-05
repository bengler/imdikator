
export function contains(content) {
  return function (element) {
    return element === content
  }
}
