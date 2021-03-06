export default [
  {
    test: 'A query with time "latest"',
    query: {
      tableName: 'befolkninghovedgruppe',
      region: 'K0101',
      unit: ['personer'],
      comparisonRegions: [],
      dimensions: [
        {
          name: 'innvkat5',
          variables: [
            'alle',
            'innvandrere',
            'bef_u_innv_og_norskf',
            'norskfodte_m_innvf'
          ]
        },
        {
          name: 'kjonn',
          variables: [
            '0',
            '1'
          ]
        },
        {
          name: 'aar',
          variables: [
            '2015'
          ]
        }
      ]
    },
    expect: {
      tableName: 'befolkninghovedgruppe',
      conditions: {
        aar: ['2015'],
        innvkat5: ['alle', 'innvandrere', 'bef_u_innv_og_norskf', 'norskfodte_m_innvf'],
        kjonn: ['0', '1'],
        enhet: ['personer'],
        kommuneNr: ['0101']
      },
      include: ['innvkat5', 'kjonn', 'aar', 'kommuneNr', 'enhet']
    }
  }
]
