export default [
  {
    test: 'A query with regions to compare with',
    query: {
      tableName: 'befolkninghovedgruppe',
      region: 'K0101',
      unit: ['personer'],
      comparisonRegions: ['B000301', 'B030101', 'K0102', 'K0103'],
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
        enhet: ['personer']
      },
      compare: {
        bydelNr: ['000301', '030101'],
        kommuneNr: ['0101', '0102', '0103']
      }
    }
  }
]
