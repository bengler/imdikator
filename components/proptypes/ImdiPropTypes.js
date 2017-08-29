import {PropTypes} from 'react'

export const region = PropTypes.shape({
  name: PropTypes.string
})

export const regionPickerGroup = PropTypes.shape({
  name: PropTypes.string,
  description: PropTypes.node,
  items: PropTypes.arrayOf(region)
})


export const route = PropTypes.shape({
  params: PropTypes.object,
  query: PropTypes.object,
  splat: PropTypes.string,
  route: PropTypes.string,
  hash: PropTypes.string,
  url: PropTypes.string,
  handler: PropTypes.func
})

export const router = PropTypes.shape({
  navigate: PropTypes.func,
  makeLink: PropTypes.func
})

export const card = PropTypes.shape({
  name: PropTypes.string
})

export const cardsPage = PropTypes.shape({
  name: PropTypes.string,
  title: PropTypes.string
})

export const chartData = PropTypes.shape({
  rows: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.number
  }))
  //... add more
})

export const querySpec = PropTypes.array

export const query = PropTypes.shape({
  dimensions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    variables: PropTypes.oneOf([
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.string
    ])
  })),
  tableName: PropTypes.string
})

export const dowloadChoices = PropTypes.arrayOf(PropTypes.shape({
  value: PropTypes.number,
  description: PropTypes.string,
  regions: PropTypes.arrayOf(region)
}))
