import React, {Component, PropTypes} from 'react'
import BarChart from '../charts/bar-chart/BarChart'
import StackedBarChart from '../charts/bar-chart/StackedBarChart'
import BenchmarkChart from '../charts/bar-chart/BenchmarkChart'
import LineChart from '../charts/line-chart/LineChart'
import StackedAreaChart from '../charts/area-chart/StackedAreaChart'
import PyramidChart from '../charts/pyramid-chart/PyramidChart'
import BubbleChart from '../charts/bubble-chart/BubbleChart'
import TableChart from '../charts/table-chart/TableChart'
import testData from './testPageData'

class RenderTestPage extends Component {
  static propTypes = {
    data: PropTypes.object
  };

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const floatStyle = {
      width: '300px',
      float: 'left',
      margin: '10px'
    }
    const fullFloatStyle = {
      width: '940px',
      float: 'left',
      margin: '10px'
    }
    return (
      <div style={{backgroundColor: '#aaa'}}>
      <h1>Rendering tests (RenderTestPage.jsx)</h1>
      <div style={{}}>
      <div style={fullFloatStyle}>
      <h3>Bar width</h3>
      <BarChart data={testData.bar}/>
      </div>
      <br style={{clear: 'left'}}/>
      <div style={fullFloatStyle}>
      <h3>Bar width multiple</h3>
      <BarChart data={testData.barWidth}/>
      </div>
      <br style={{clear: 'left'}}/>
      <div style={fullFloatStyle}>
      <h3>Stacked width multiple</h3>
      <StackedBarChart data={testData.barWidth}/>
      </div>
      <br style={{clear: 'left'}}/>
      <div style={fullFloatStyle}>
      <h3>StackedBar width</h3>
      <StackedBarChart data={testData.stackedBar2}/>
      </div>
      <br style={{clear: 'left'}}/>
      <div style={fullFloatStyle}>
      <h3>Benchmark width</h3>
      <BenchmarkChart data={testData.bench6}/>
      </div>
      <br style={{clear: 'left'}}/>
      <div style={floatStyle}>
      <h3>Linjebrytende X akse label</h3>
      <BarChart data={testData.bar}/>
      </div>
      <div style={floatStyle}>
      <h3>Mange korte legends</h3>
      <BarChart data={testData.bar2}/>
      </div>
      <div style={floatStyle}>
      <h3>Første veldig lang</h3>
      <BarChart data={testData.bar3}/>
      </div>
      <br style={{clear: 'left'}}/>
      <div style={floatStyle}>
      <h3>Stacked bar</h3>
      <StackedBarChart data={testData.stackedBar1}/>
      </div>
      <div style={floatStyle}>
      <h3>Kroner i Y akse</h3>
      <BarChart data={testData.bar4}/>
      </div>
      <div style={floatStyle}>
      <h3>Negative kroner</h3>
      <BarChart data={testData.bar5}/>
      </div>
      <br style={{clear: 'left'}}/>
      <div style={floatStyle}>
      <h3>negativ og positiv</h3>
      <BarChart data={testData.bar6}/>
      </div>
      <div style={floatStyle}>
      <h3>Bare negative</h3>
      <BarChart data={testData.bar7}/>
      </div>
      <br style={{clear: 'left'}}/>
      </div>
      <div style={floatStyle}>
      <h3>Benchmark</h3>
      <BenchmarkChart data={testData.bench1}/>
      </div>
      <div style={floatStyle}>
      <h3>Benchmark med highlight</h3>
      <BenchmarkChart data={testData.bench2}/>
      </div>
      <br style={{clear: 'left'}}/>
      <div style={floatStyle}>
      <h3>Benchmark anonymisert</h3>
      <BenchmarkChart data={testData.bench3}/>
      </div>
      <div style={floatStyle}>
      <h3>Benchmark anon highlight</h3>
      <BenchmarkChart data={testData.bench4}/>
      </div>
      <div style={floatStyle}>
      <h3>Benchmark missing highlight</h3>
      <BenchmarkChart data={testData.bench5}/>
      </div>
      <br style={{clear: 'left'}}/>
      <div style={floatStyle}>
      <h3>Line</h3>
      <LineChart data={testData.line1}/>
      </div>
      <div style={floatStyle}>
      <h3>Line anon</h3>
      <LineChart data={testData.line2}/>
      </div>
      <br style={{clear: 'left'}}/>
      <div style={floatStyle}>
      <h3>Line with gap</h3>
      <LineChart data={testData.line3}/>
      </div>
      <div style={floatStyle}>
      <h3>Line missing data</h3>
      <LineChart data={testData.line4}/>
      </div>
      <div style={floatStyle}>
      <h3>Line anon</h3>
      <LineChart data={testData.line5}/>
      </div>
      <br style={{clear: 'left'}}/>
      <br style={{clear: 'left'}}/>
      <div style={floatStyle}>
      <h3>Stacked Area</h3>
      <StackedAreaChart data={testData.area1}/>
      </div>
      <br style={{clear: 'left'}}/>
      <div style={floatStyle}>
      <h3>Pyramid</h3>
      <PyramidChart data={testData.pyramid1}/>
      </div>
      <div style={floatStyle}>
      <h3>Pyramid anon</h3>
      <PyramidChart data={testData.pyramid2}/>
      </div>
      <div style={floatStyle}>
      <h3>Pyramid missing</h3>
      <PyramidChart data={testData.pyramid3}/>
      </div>
      <br style={{clear: 'left'}}/>
      <div style={fullFloatStyle}>
      <h3>Bubble</h3>
      <BubbleChart data={testData.bubble1}/>
      </div>
      <br style={{clear: 'left'}}/>
      <div style={floatStyle}>
      <h3>Bubble sammenliknet</h3>
      <BubbleChart data={testData.bubble2}/>
      </div>
      <div style={floatStyle}>
      <h3>Bubble anonymisert</h3>
      <BubbleChart data={testData.bubble3}/>
      </div>
      <br style={{clear: 'left'}}/>
      <h3>Table</h3>
      <div style={{width: '100%'}}>
      <TableChart data={testData.pyramid1}/>
      </div>
      </div>
    )
  }
}

// Wrap the component to inject dispatch and state into it
export default RenderTestPage
