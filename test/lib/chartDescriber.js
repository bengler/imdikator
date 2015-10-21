import {assert} from 'chai'
import {describeChart} from '../../lib/chartDescriber'


describe('chartDescriber', () => {

  it('returns a function', () => {
    assert.typeOf(describeChart, 'function')
  })


  it('describes what to show', () => {
    const opts = {
      showing: 'flyktninger'
    }
    assert.equal(describeChart(opts), 'Figuren viser flyktninger')
  })


  it('describes the bounds', () => {
    const opts = {
      showing: 'flyktninger',
      bounds: ['aldersfordeling avgrenset til 0-3 år', 'kjønnsfordeling avgrenset til kvinner', 'bakgrunn avgrenset til innvandrere']
    }
    const expected = 'Figuren viser flyktninger med aldersfordeling avgrenset til 0-3 år, kjønnsfordeling avgrenset til kvinner, og bakgrunn avgrenset til innvandrere'
    assert.equal(describeChart(opts), expected)
  })


  it('describes groupedBy', () => {
    const opts = {
      showing: 'flyktninger',
      groupedBy: ['flyktninger', 'befolkningsgrupper']
    }
    const expected = 'Figuren viser flyktninger fordelt på flyktninger og befolkningsgrupper'
    assert.equal(describeChart(opts), expected)
  })


  it('describes timePeriod', () => {
    const opts = {
      showing: 'flyktninger',
      timePeriod: ['2013']
    }
    let expected = 'Figuren viser flyktninger i 2013'
    assert.equal(describeChart(opts), expected)
    opts.timePeriod = ['2013', '2014']
    expected = 'Figuren viser flyktninger i perioden 2013 til 2014'
    assert.equal(describeChart(opts), expected)
  })


  it('describes regions', () => {
    const opts = {
      showing: 'flyktninger',
      timePeriod: ['2013'],
      regions: ['Sandefjord', 'Drøbak', 'Larvik', 'Bø i Telemark']
    }
    let expected = 'Figuren viser flyktninger i 2013 fra Sandefjord, Drøbak, Larvik, og Bø i Telemark'
    assert.equal(describeChart(opts), expected)

    opts.regions = ['Sandefjord']
    opts.comparisonType = 'kommuner'
    expected = 'Figuren viser flyktninger i 2013 fra Sandefjord sammenlignet med lignende kommuner'
    assert.equal(describeChart(opts), expected)
  })

  it('describes everything at once', () => {
    const opts = {
      showing: 'flyktninger',
      bounds: ['aldersfordeling avgrenset til 0-3 år', 'kjønnsfordeling avgrenset til kvinner', 'bakgrunn avgrenset til innvandrere'],
      groupedBy: ['flyktninger', 'befolkningsgrupper'],
      timePeriod: ['2012', '2014'],
      regions: ['Sandefjord', 'Drøbak', 'Larvik', 'Bø i Telemark']
    }
    const expected = 'Figuren viser flyktninger med aldersfordeling avgrenset til 0-3 år, kjønnsfordeling avgrenset til kvinner, og bakgrunn avgrenset til innvandrere fordelt på flyktninger og befolkningsgrupper i perioden 2012 til 2014 fra Sandefjord, Drøbak, Larvik, og Bø i Telemark'
    assert.equal(describeChart(opts), expected)
  })

  it('describes everything at once, with comaparisionType', () => {
    const opts = {
      showing: 'flyktninger',
      bounds: ['aldersfordeling avgrenset til 0-3 år', 'kjønnsfordeling avgrenset til kvinner', 'bakgrunn avgrenset til innvandrere'],
      groupedBy: ['flyktninger', 'befolkningsgrupper'],
      timePeriod: ['2012', '2014'],
      regions: ['Sandefjord'],
      comparisonType: 'kommuner'
    }
    const expected = 'Figuren viser flyktninger med aldersfordeling avgrenset til 0-3 år, kjønnsfordeling avgrenset til kvinner, og bakgrunn avgrenset til innvandrere fordelt på flyktninger og befolkningsgrupper i perioden 2012 til 2014 fra Sandefjord sammenlignet med lignende kommuner'
    assert.equal(describeChart(opts), expected)
  })

})
