import {defaults as reqDefaults} from './request'


const defaultRequest = reqDefaults()
export const get = create(defaultRequest, 'get')
export const post = create(defaultRequest, 'post')

export function defaults(options) {
  const request = reqDefaults(options)
  return {
    get: create(request, 'get'),
    post: create(request, 'post')
  }
}

function create(request, method) {
  const req = function (...args) {
    return request[method](...args)
      .then(response => {
        response.json = JSON.parse(response.body)
        return response
      })
      .catch(error => {
        error.json = JSON.parse(error.response.body)
        return Promise.reject(error)
      })
  }

  const ownPropertyDescriptor = Object.getOwnPropertyDescriptor(req, 'name')
  if (ownPropertyDescriptor && ownPropertyDescriptor.configurable) {
    Object.defineProperty(req, 'name', {value: method})
  }
  return req
}
