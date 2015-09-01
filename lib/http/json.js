import {request} from './request'


export const get = create('get')
export const put = create('post')
export const post = create('post')

function create(method) {
  const req = function (...args) {
    return request[method](...args)
      .then(response => {
        response.json = JSON.parse(response.body)
        return response
      })
  }

  if (Object.getOwnPropertyDescriptor(req, 'name').configurable) {
    Object.defineProperty(req, 'name', {value: method})
  }
  return req
}
