import inspect from 'object-inspect'

const codes = {
  SERVER_ERROR: 'An error occurred while processing request',
  INVALID_API_CALL: 'Invalid API call',
  CONNECTION_ERROR: 'Could not connect to the api',
  UNKNOWN_ERROR: 'An unknown error occurred'
}

const isWrapped = Symbol()

function _wrap(original, code, details) {
  if (!codes.hasOwnProperty(code)) {
    throw new Error(`Invalid error code: ${code}.`)
  }
  const error = new Error(`${codes[code]}: ${original.message}`)
  error.code = code
  error.details = details
  error._original = original
  error[isWrapped] = true
  error.stack = `${error.stack}\n${original.stack.split('\n').slice(1).join('\n')}`

  return error
}

export function wrap(error, code, details) {
  if (!(error instanceof Error)) {
    throw new Error(`Cannot wrap non-Error object ${inspect(error)}`)
  }
  return (error[isWrapped] ? error : _wrap(error, code, details))
}
