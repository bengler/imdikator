import request from './request'

export function get(...args) {
  return request.get(...args)
    .then(response => {
      response.json = JSON.parse(response.body)
      return response
    })
}
