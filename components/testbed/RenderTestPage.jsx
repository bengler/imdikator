import React, {Component, PropTypes} from 'react'
import BarChart from '../charts/bar-chart/BarChart'

/* eslint-disable */
const testData = {
  bar: {
    dimensions: ['fylkeNr', 'landbakgrunn'],
    unit: 'personer',
    rows: [
      { 'aar': '2014', 'landbakgrunn': '101', 'enhet': 'personer', 'tabellvariabel': '3294', 'fylkeNr': 'Fryktelig lang og kjedelig label for denne dataserien som vi forsøker å få inn på X-aksen' }
    ]
  },
  bar2: {
    dimensions: ['fylkeNr', 'landbakgrunn'],
    unit: 'personer',
    rows: [
      { 'aar': '2014', 'landbakgrunn': '101', 'enhet': 'personer', 'tabellvariabel': '3294', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '102', 'enhet': 'personer', 'tabellvariabel': '16', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '103', 'enhet': 'personer', 'tabellvariabel': '1161', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '104', 'enhet': 'personer', 'tabellvariabel': '52', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '105', 'enhet': 'personer', 'tabellvariabel': '935', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '106', 'enhet': 'personer', 'tabellvariabel': '13162', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '111', 'enhet': 'personer', 'tabellvariabel': '288', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '112', 'enhet': 'personer', 'tabellvariabel': '221', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '113', 'enhet': 'personer', 'tabellvariabel': '1138', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '114', 'enhet': 'personer', 'tabellvariabel': '6', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '115', 'enhet': 'personer', 'tabellvariabel': '624', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '117', 'enhet': 'personer', 'tabellvariabel': '1841', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '118', 'enhet': 'personer', 'tabellvariabel': '0', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '119', 'enhet': 'personer', 'tabellvariabel': '608', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '120', 'enhet': 'personer', 'tabellvariabel': '148', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': 'En kjempelang label midt inne i de andre fine korte labels', 'enhet': 'personer', 'tabellvariabel': '203', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': 'Veldig', 'enhet': 'personer', 'tabellvariabel': '710', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': 'kort', 'enhet': 'personer', 'tabellvariabel': '1084', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': 'label', 'enhet': 'personer', 'tabellvariabel': '885', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '126', 'enhet': 'personer', 'tabellvariabel': '11', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '127', 'enhet': 'personer', 'tabellvariabel': '696', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '128', 'enhet': 'personer', 'tabellvariabel': ':', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '129', 'enhet': 'personer', 'tabellvariabel': '6', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '130', 'enhet': 'personer', 'tabellvariabel': '4', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '131', 'enhet': 'personer', 'tabellvariabel': '13595', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '132', 'enhet': 'personer', 'tabellvariabel': '694', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '133', 'enhet': 'personer', 'tabellvariabel': '1858', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '134', 'enhet': 'personer', 'tabellvariabel': ':', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '136', 'enhet': 'personer', 'tabellvariabel': '2472', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '137', 'enhet': 'personer', 'tabellvariabel': '1443', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '138', 'enhet': 'personer', 'tabellvariabel': '165', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '139', 'enhet': 'personer', 'tabellvariabel': '2591', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '140', 'enhet': 'personer', 'tabellvariabel': '2834', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '141', 'enhet': 'personer', 'tabellvariabel': '289', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '143', 'enhet': 'personer', 'tabellvariabel': '3871', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '144', 'enhet': 'personer', 'tabellvariabel': '3246', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '146', 'enhet': 'personer', 'tabellvariabel': '89', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '148', 'enhet': 'personer', 'tabellvariabel': '688', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '152', 'enhet': 'personer', 'tabellvariabel': '632', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '153', 'enhet': 'personer', 'tabellvariabel': '284', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '154', 'enhet': 'personer', 'tabellvariabel': '0', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '155', 'enhet': 'personer', 'tabellvariabel': '2541', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '156', 'enhet': 'personer', 'tabellvariabel': '1302', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '157', 'enhet': 'personer', 'tabellvariabel': '503', 'fylkeNr': '03' },
      { 'aar': '2014', 'landbakgrunn': '158', 'enhet': 'personer', 'tabellvariabel': '457', 'fylkeNr': '03' },
    ]
  },
  bar3: {
    dimensions: ['fylkeNr', 'landbakgrunn'],
    unit: 'personer',
    rows: [
      { 'aar': '2014', 'landbakgrunn': 'En kjempelang label, nesten for lang ville mange ha sagt. Men her er den altså', 'enhet': 'personer', 'tabellvariabel': '1', 'fylkeNr': 'Fryktelig lang og kjedelig label for denne dataserien som vi forsøker å få inn på X-aksen' },
      { 'aar': '2014', 'landbakgrunn': 'En ikke veldig lang en', 'enhet': 'personer', 'tabellvariabel': '2', 'fylkeNr': 'Fryktelig lang og kjedelig label for denne dataserien som vi forsøker å få inn på X-aksen' },
    ]
  }
}
/* eslint-enable */

class RenderTestPage extends Component {
  static propTypes = {
    data: PropTypes.object
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    return (
      <div style={{backgroundColor: '#aaa'}}>
      <h3>Linjebrytende X akse label</h3>
      <div style={{width: '300px'}}>
      <BarChart data={testData.bar}/>
      </div>
      <h1>Rendering tests</h1>
      <h3>Mange korte legends</h3>
      <div style={{width: '300px'}}>
      <BarChart data={testData.bar2}/>
      </div>
      <h3>Første veldig lang</h3>
      <div style={{width: '300px'}}>
      <BarChart data={testData.bar3}/>
      </div>
      </div>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default RenderTestPage
