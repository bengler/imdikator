export const debounce = (func, wait, immediate) => {
  let timeout

  return function() {
    let context = this
    let args = arguments

    const later = function() {
      timeout = null
			if (!immediate) func.apply(context, args)
    }

    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)

    if (callNow) func.apply(context, args)
  }
}

export default debounce
