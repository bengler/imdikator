import React from 'react'
import d3 from 'd3'
import D3Chart from '../../utils/D3Chart'

const sampleData = [
  {series: '1', value: 33686},
  {series: '101', value: 1169},
  {series: '102', value: 10},
  {series: '103', value: 256},
  {series: '104', value: 29},
  {series: '105', value: 433},
  {series: '106', value: 2257},
  {series: '111', value: 50},
  {series: '112', value: 44},
  {series: '113', value: 144},
  {series: '114', value: 0},
  {series: '115', value: 208},
  {series: '117', value: 111},
  {series: '118', value: 0},
  {series: '119', value: 79},
  {series: '120', value: 52},
  {series: '121', value: 30},
  {series: '122', value: 197},
  {series: '123', value: 78},
  {series: '124', value: 371},
  {series: '127', value: 256},
  {series: '129', value: 0},
  {series: '131', value: 5232},
  {series: '132', value: 62},
  {series: '133', value: 300},
  {series: '134', value: 0},
  {series: '136', value: 1436},
  {series: '137', value: 191},
  {series: '138', value: 19},
  {series: '139', value: 406},
  {series: '140', value: 656},
  {series: '141', value: 66},
  {series: '143', value: 477},
  {series: '144', value: 817},
  {series: '146', value: 31},
  {series: '148', value: 159},
  {series: '152', value: 184},
  {series: '153', value: 61},
  {series: '154', value: 0},
  {series: '155', value: 1704},
  {series: '156', value: 178},
  {series: '157', value: 173},
  {series: '158', value: 89},
  {series: '159', value: 264},
  {series: '160', value: 39},
  {series: '161', value: 1690},
  {series: '162', value: 0},
  {series: '163', value: 0},
  {series: '164', value: 0},
  {series: '203', value: 67},
  {series: '204', value: 31},
  {series: '205', value: 0},
  {series: '209', value: 0},
  {series: '213', value: 0},
  {series: '216', value: 50},
  {series: '220', value: 0},
  {series: '235', value: 0},
  {series: '239', value: 6},
  {series: '241', value: 224},
  {series: '246', value: 130},
  {series: '249', value: 38},
  {series: '250', value: 0},
  {series: '254', value: 0},
  {series: '256', value: 23},
  {series: '260', value: 28},
  {series: '270', value: 20},
  {series: '273', value: 21},
  {series: '276', value: 81},
  {series: '278', value: 10},
  {series: '279', value: 218},
  {series: '281', value: 0},
  {series: '283', value: 43},
  {series: '286', value: 22},
  {series: '299', value: 0},
  {series: '303', value: 191},
  {series: '304', value: 0},
  {series: '307', value: 18},
  {series: '308', value: 6},
  {series: '313', value: 78},
  {series: '322', value: 0},
  {series: '326', value: 9},
  {series: '329', value: 49},
  {series: '333', value: 0},
  {series: '336', value: 5},
  {series: '337', value: 0},
  {series: '339', value: 16},
  {series: '346', value: 1806},
  {series: '355', value: 6},
  {series: '356', value: 50},
  {series: '357', value: 0},
  {series: '359', value: 38},
  {series: '369', value: 25},
  {series: '373', value: 0},
  {series: '376', value: 0},
  {series: '379', value: 47},
  {series: '386', value: 73},
  {series: '389', value: 11},
  {series: '393', value: 0},
  {series: '404', value: 459},
  {series: '406', value: 6},
  {series: '407', value: 24},
  {series: '409', value: 0},
  {series: '410', value: 6},
  {series: '416', value: 0},
  {series: '420', value: 79},
  {series: '424', value: 97},
  {series: '426', value: 8},
  {series: '428', value: 801},
  {series: '430', value: 24},
  {series: '432', value: 7},
  {series: '436', value: 16},
  {series: '444', value: 178},
  {series: '448', value: 38},
  {series: '452', value: 2853},
  {series: '456', value: 965},
  {series: '460', value: 24},
  {series: '464', value: 31},
  {series: '476', value: 23},
  {series: '480', value: 41},
  {series: '484', value: 312},
  {series: '492', value: 24},
  {series: '496', value: 43},
  {series: '500', value: 9},
  {series: '502', value: 4},
  {series: '504', value: 4},
  {series: '508', value: 95},
  {series: '510', value: 4},
  {series: '512', value: 14},
  {series: '513', value: 0},
  {series: '516', value: 4},
  {series: '520', value: 0},
  {series: '524', value: 144},
  {series: '528', value: 20},
  {series: '534', value: 614},
  {series: '537', value: 0},
  {series: '544', value: 7},
  {series: '548', value: 6},
  {series: '552', value: 11},
  {series: '554', value: 17},
  {series: '564', value: 257},
  {series: '568', value: 827},
  {series: '575', value: 1100},
  {series: '578', value: 13},
  {series: '601', value: 0},
  {series: '603', value: 0},
  {series: '605', value: 0},
  {series: '606', value: 0},
  {series: '608', value: 0},
  {series: '612', value: 49},
  {series: '613', value: 0},
  {series: '620', value: 40},
  {series: '622', value: 0},
  {series: '624', value: 16},
  {series: '629', value: 0},
  {series: '631', value: 0},
  {series: '632', value: 6},
  {series: '648', value: 6},
  {series: '650', value: 0},
  {series: '652', value: 29},
  {series: '654', value: 0},
  {series: '657', value: 0},
  {series: '658', value: 0},
  {series: '659', value: 0},
  {series: '660', value: 0},
  {series: '661', value: 0},
  {series: '664', value: 10},
  {series: '676', value: 0},
  {series: '677', value: 0},
  {series: '679', value: 0},
  {series: '680', value: 9},
  {series: '681', value: 0},
  {series: '684', value: 277},
  {series: '686', value: 0},
  {series: '687', value: 0},
  {series: '705', value: 22},
  {series: '710', value: 7},
  {series: '715', value: 135},
  {series: '720', value: 10},
  {series: '725', value: 186},
  {series: '730', value: 47},
  {series: '735', value: 22},
  {series: '740', value: 0},
  {series: '745', value: 0},
  {series: '755', value: 7},
  {series: '760', value: 39},
  {series: '770', value: 7},
  {series: '775', value: 9},
  {series: '802', value: 0},
  {series: '805', value: 29},
  {series: '806', value: 0},
  {series: '807', value: 0},
  {series: '808', value: 0},
  {series: '809', value: 0},
  {series: '812', value: 0},
  {series: '813', value: 0},
  {series: '814', value: 0},
  {series: '815', value: 0},
  {series: '816', value: 0},
  {series: '817', value: 0},
  {series: '818', value: 0},
  {series: '819', value: 0},
  {series: '820', value: 12},
  {series: '821', value: 0},
  {series: '822', value: 0},
  {series: '826', value: 0},
  {series: '827', value: 0},
  {series: '828', value: 0},
  {series: '829', value: 0},
  {series: '830', value: 0},
  {series: '832', value: 0},
  {series: '833', value: 0},
  {series: '835', value: 0},
  {series: '840', value: 0},
  {series: '970', value: 55},
  {series: '980', value: 0},
  {series: '990', value: 0}
]

export default class BubbleChart extends React.Component {
  drawPoints(el, data) {
    const diameter = d3.min([this.size.width, this.size.height])
    const color = d3.scale.category20c()

    const bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5)

    data = data.filter(d => d.value > 0)

    const circles = data.map(d => {
      return {
        value: d.value,
        key: d.series
      }
    })

    const node = this.svg.selectAll('.node')
    .data(bubble.nodes({children: circles}).filter(d => !d.children))
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')

    node.append('title')
    .text(d => d.key)

    node.append('circle')
    .attr('r', d => d.r)
    .style('fill', d => color(d.key))

    // FIXME: Adding text wrecks havoc in large datasets
    /*
    node.append('text')
    .attr('dy', '.3em')
    .style('text-anchor', 'middle')
    .text(d => d.key)
    */
  }

  render() {
    const margins = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    }
    return (
      <D3Chart data={sampleData} drawPoints={this.drawPoints} margins={margins}/>
    )
  }
}


