export default [
  {
    name: 'befolkning_hovedgruppe',
    query: {
      year: 'latest',
      tableName: 'befolkning_hovedgruppe',
      unit: 'prosent',
      dimensions: [
        {
          name: 'innvkat5',
          variables: ['innvandrere']
        },
        {
          name: 'kjonn',
          variables: [
            'alle'
          ]
        }
      ]
    },
    title: share => {
      return `Innvandrere utgjør ${share}% av befolkning`
    },
    subTitle: share => {
      return `For hele landet er tallet ${share}%`
    }
  },
  {
    name: 'flyktninger_befolkningsandel',
    query: {
      year: 'latest',
      tableName: 'bosatt_befolkning',
      unit: 'promille',
      dimensions: [
        {
          name: 'bosetting',
          variables: ['bosatt_per_1000']
        }
      ]
    },
    title: share => {
      return `Flyktninger utgjør ${share}‰ av befolkningen`
    },
    subTitle: share => {
      return `For hele landet er tallet ${share}‰`
    },
  }
]
