import textures from 'textures'

export const colors = ['#15c2e8', '#f56d00', '#ffd300', '#c792ca', '#50a450', '#1d70b7', '#ba4b7a', '#418541', '#f15540']

export const colorTextures = {
  '#15c2e8': () => {
    return textures.lines().lighter()
    .stroke('#73daf1')
    .background('#15c2e8')
  },
  '#f56d00': () => {
    return textures.lines().thicker().orientation("6/8")
    .stroke('#f78a33')
    .background('#f56d00')
  },  
  '#ffd300': () => {
    return textures.lines().heavier().orientation("2/8", "6/8")
    .stroke('#ffe566')
    .background('#ffd300')
  },    
  '#c792ca': () => {
    return textures.lines().lighter().orientation("6/8")
    .stroke('#d2a8d5')
    .background('#c792ca')
  },
  '#50a450': () => {
    return textures.lines().thicker().orientation("2/8", "6/8")
    .stroke('#73b673')
    .background('#50a450')
  },   
  '#1d70b7': () => {
    return textures.lines().heavier()
    .stroke('#4a8dc5')
    .background('#1d70b7')
  },
  '#ba4b7a': () => {
    return textures.lines().lighter().orientation("2/8", "6/8")
    .stroke('#c86f95')
    .background('#ba4b7a')
  },
  '#418541': () => {
    return textures.lines().thicker()
    .stroke('#679d67')
    .background('#418541')
  },      
  '#f15540': () => {
    return textures.lines().heavier().orientation("6/8")
    .stroke('#f47766')
    .background('#f15540')
  }  
}

