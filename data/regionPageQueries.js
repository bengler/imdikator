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
          variables: ['alle']
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
  },
  {
    name: 'innvandrere_intro_arbied',
    query: {
      year: 'latest',
      tableName: 'intro_avslutning_direkte',
      unit: 'prosent',
      dimensions: [
        {
          name: 'avslutningArsak8',
          variables: ['arbeid']
        },
        {
          name: 'kjonn',
          variables: ['alle']
        }
      ]
    },
    title: share => {
      return `${share}% av innvandrerne går direkte fra introprogram til arbeid/utdanning`
    },
    subTitle: share => {
      return `Gjennomsnittet i Norge er ${share}‰`
    },
  }
]
