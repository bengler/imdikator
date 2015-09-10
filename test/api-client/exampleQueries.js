
const HALDEN = {
  type: 'municipality',
  code: '0101',
  name: 'Halden',
  fylkeCode: '1',
  imdiRegion: 'IMDi Øst',
  naeringsRegionCode: '1',
  centralityNumber: '3',
  centralityName: 'Sentrale kommuner'
}

export default [
  {
    test: 'A query with time "latest"',
    region: HALDEN,
    metadata: {
      uniqueValues: {aar: ['2015', '2010', '2009']}
    },
    query: {
      table: 'befolkninghovedgruppe',
      dimensions: [
        {
          label: 'innvkat5',
          include: [
            'alle',
            'innvandrere',
            'bef_u_innv_og_norskf',
            'norskfodte_m_innvf'
          ]
        },
        {
          label: 'kjonn',
          include: [
            '0',
            '1'
          ]
        }
      ],
      time: 'latest',
      defaultUnit: 'personer'
    },
    expect: {
      tableName: 'befolkninghovedgruppe',
      conditions: {
        aar: ['2015'],
        innvkat5: ['alle', 'innvandrere', 'bef_u_innv_og_norskf', 'norskfodte_m_innvf'],
        kjonn: ['0', '1'],
        enhet: ['personer'],
        kommuneId: ['0101']
      },
      include: ['aar', 'tabellvariabel', 'enhet', 'innvkat5', 'kjonn']
    }
  }
]
