import React from 'react'
import BarChart from '../components/charts/bar-chart/BarChart'
import AreaChart from '../components/charts/area-chart/AreaChart'


React.render(<BarChart/>, document.getElementById('barChart'))
React.render(<AreaChart/>, document.getElementById('areaChart'))
