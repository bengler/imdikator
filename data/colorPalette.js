import textures from 'textures'

export const colorTextures = {
  '#ffd300': () => {
    return textures.lines()
    .stroke('#f48335')
    .background('#f36d20')
  },
  '#f56d00': () => {
    return textures.lines()
    .stroke('#f48335')
    .background('#f36d20')
  },
  '#15c2e8': () => {
    return textures.lines()
    .stroke('#f48335')
    .background('#f36d20')
  },
  '#1d70b7': () => {
    return textures.lines()
    .stroke('#f48335')
    .background('#f36d20')
  },
  '#c792ca': () => {
    return textures.lines()
    .stroke('#f48335')
    .background('#f36d20')
  },
  '#ba4b7a': () => {
    return textures.lines()
    .stroke('#f48335')
    .background('#f36d20')
  },
}

export const colors = Object.keys(colorTextures)
