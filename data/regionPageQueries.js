
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
    title: share => {
      return `Innvandrere utgjør ${share} av befolkning`
    },
    subTitle: share => {
      return `For hele landet er tallet ${share}`
    }
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
    title: share => {
      return `Flyktninger utgjør ${share} av befolkningen`
    },
    subTitle: share => {
      return `For hele landet er tallet ${share}`
    }
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
    title: share => {
      return `${share} av innvandrere er i arbeid`
    },
    subTitle: share => {
      return `For hele landet er tallet ${share}`
    }
  }
]
