export default [
  {
    test: 'A query with time "latest"',
    metadata: {
      uniqueValues: {aar: ['2015', '2010', '2009']}
    },
    query: {
      tableName: 'befolkninghovedgruppe',
      region: 'K0101',
      unit: 'personer',
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
      include: ['enhet', 'innvkat5', 'kjonn', 'aar', 'kommuneNr']
    }
  }
]
