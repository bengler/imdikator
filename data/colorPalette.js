import textures from 'textures'

export const colors = [
  '#1d70b7',
  '#15c2e8',
  '#418541',
  '#5abb5b',
  '#f56d00',
  '#ffd300',
  '#c792ca',
  '#ba4b7a',
  '#f15540'
]
export const benchmarkColor = '#9fd59f'
export const benchmarkHighLightColor = '#418541'

export const colorTextures = {
  '#1d70b7': () => {
    return textures.lines().lighter()
    .stroke('#4a8dc5')
    .background('#1d70b7')
  },
  '#15c2e8': () => {
    return textures.lines().orientation('6/8').thicker()
    .stroke('#73daf1')
    .background('#15c2e8')
  },
  '#418541': () => {
    return textures.lines()
      .orientation('horizontal')
      .size(5)
      .shapeRendering('crispEdges')
      .stroke('#679d67')
      .background('#418541')
  },
  '#5abb5b': () => {
    return textures.lines()
      .orientation('vertical')
      .size(8)
      .strokeWidth(1)
      .shapeRendering('crispEdges')
      .stroke('#7bc97c')
      .background('#5abb5b')
  },
  '#f56d00': () => {
    return textures.lines().thicker()
    .stroke('#f78a33')
    .background('#f56d00')
  },
  '#ffd300': () => {
    return textures.lines().orientation('6/8').lighter()
    .stroke('#ffe566')
    .background('#ffd300')
  },
  '#c792ca': () => {
    return textures.lines()
      .orientation('vertical')
      .size(5)
      .shapeRendering('crispEdges')
      .stroke('#d2a8d5')
      .background('#c792ca')
  },
  '#ba4b7a': () => {
    return textures.lines()
      .orientation('horizontal')
      .size(8)
      .strokeWidth(1)
      .shapeRendering('crispEdges')
      .stroke('#c86f95')
      .background('#ba4b7a')
  },
  '#f15540': () => {
    return textures.lines()
    .stroke('#f47766')
    .background('#f15540')
  }
}

export const colorLabels = {
  '#1d70b7': '#ffffff',
  '#15c2e8': '#000000',
  '#418541': '#ffffff',
  '#5abb5b': '#000000',
  '#f56d00': '#000000',
  '#ffd300': '#000000',
  '#c792ca': '#000000',
  '#ba4b7a': '#ffffff',
  '#f15540': '#000000'
}
