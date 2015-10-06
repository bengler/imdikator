export default [
  {
    name: 'befolkning_hovedgruppe',
    query: {
      dimensions: [
        {
          name: 'innvkat5',
          variables: [
            'innvandrere',
            'bef_u_innv_og_norskf',
            'norskfodte_m_innvf'
          ]
        },
        {
          name: 'kjonn',
          variables: [
            'alle'
          ]
        }
      ],
      tableName: 'befolkning_hovedgruppe',
      unit: 'personer'
    },
    title: 'Innvandrere utgjør 17,6% av befolkning',
    subTitle: 'For hele landet er tallet 12,4%'
  },
  {
    name: 'flytting',
    query: {
      dimensions: [
        {
          name: 'vreg3',
          variables: [
            'alle'
          ],
          visible: false
        },
        {
          name: 'flytting'
        },
        {
          name: 'innvkat3',
          variables: [
            'innvandrere',
            'befolkningen_ellers'
          ]
        }
      ],
      tableName: 'befolkning_flytting',
      unit: 'personer'
    },
    title: 'Flyktninger utgjør 0,062 % av befolkningen',
    subTitle: 'For hele landet er tallet 0,083%'
  },
  {
    name: 'norskopplaering-resultater',
    query: {
      dimensions: [
        {
          name: 'provetype'
        },
        {
          name: 'spraaknivaa'
        }
      ],
      tableName: 'norsk_prover',
      unit: 'prosent'
    },
    title: '64,5% av innvandrere er i arbeid',
    subTitle: 'For hele landet er tallet 63,1%'
  }
]
