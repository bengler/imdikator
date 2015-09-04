import {combineReducers} from 'redux'
import {NAVIGATE} from '../actions'

function route(state = {}, action) {
  switch (action.type) {
    case NAVIGATE:
      return action.match
    default:
      return state
  }
}

const data = {
  route: {query: '//'},
  query: '//...',

  focusedAdministrativeUnit: {
    kind: 'fylke',
    id: '001'
  },

  currentTablePresenter: {},

  tablePresenters: [
    {
      query: {},
      data: {},
      group: 'Befolkning',
      subGroup: 'Oprinnelse',
      id: 'befolkning',
      title: 'Hvor er de fra?',          // <- config
      tableDescription: {                 // <- reference here, but move to data
        tableName: 'befolknggr24',         // <- config == the visma
        dimensions: [     // <- generate from The Visma
          {
            name: 'kjonn',
            categories: [0, 1]
          },
          {
            name: 'alderGupper',
            categories: ['3-5', '8-10']
          },
          {
            name: 'invkat_3',
            categories: ['folk', 'andreFolk']
          }
        ],
        units: ['person', 'prosent'],
        years: [2014],
        forAdministrativeUnits: ['bydel', 'fylke', 'kommune', 'naeringsomraade', 'norge']
      },
      displayOptions: { // <- config
        orderOfDimensionsAndCategories: [
          {
            name: 'invkat_3',
            categories: ['folk', 'andreFolk']
          }
        ],
        displayCurrentYearAs: 'bubble' // You really only need to set this for the one bubble chart
      }
    }
  ]
}

const app = combineReducers({route})

export default app
