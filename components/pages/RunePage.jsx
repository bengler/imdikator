import React, {Component, PropTypes} from 'react'
import TablePresenter from '../elements/TablePresenter'
import {selectDataView} from '../../actions'

const sampleData = [
  {category: 'Arbeidsinnvandrere', series: 'Menn', value: 50},
  {category: 'Arbeidsinnvandrere', series: 'Kvinner', value: 10},
  {category: 'Familieforente', series: 'Menn', value: 30},
  {category: 'Familieforente', series: 'Kvinner', value: 15},
  {category: 'Flyktninger og familiegjenforente til disse', series: 'Menn', value: 75},
  {category: 'Flyktninger og familiegjenforente til disse', series: 'Kvinner', value: 45},
  {category: 'Utdanning (inkl. au pair), uoppgitte eller andre grunner', series: 'Menn', value: 20},
  {category: 'Utdanning (inkl. au pair), uoppgitte eller andre grunner', series: 'Kvinner', value: 45},
]

export default class RunePage extends Component {
  static propTypes = {
    route: PropTypes.object,
    dispatch: PropTypes.function
  }

  render() {
    const title = 'Befolkningsetterllerannet'
    const chartType = 'bar'
    const onSelectDataView = type => this.props.dispatch(selectDataView(type))
    return (
      <div>
        <TablePresenter onSelectDataView={onSelectDataView} data={sampleData} title={title} chart={chartType}/>
      </div>
    )
  }
}
