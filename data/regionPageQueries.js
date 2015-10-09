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
    additionalTitleParams: [],
    title: options => {
      return `Innvandrere utgjør ${options.share}% av befolkning`
    },
    subTitle: options => {
      return `For hele landet er tallet ${options.share}%`
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
    additionalTitleParams: [],
    title: options => {
      return `Flyktninger utgjør ${options.share}‰ av befolkningen`
    },
    subTitle: options => {
      return `For hele landet er tallet ${options.share}‰`
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
    additionalTitleParams: [],
    title: options => {
      return `${options.share}% av innvandrerne går direkte fra introprogram til arbeid/utdanning`
    },
    subTitle: options => {
      return `Gjennomsnittet i Norge er ${options.share}%`
    },
  },
  {
    name: 'bosatt_anmodet',
    query: {
      year: 'latest',
      tableName: 'bosatt_anmodede',
      unit: 'prosent',
      dimensions: [
        {
          name: 'bosetting',
          variables: ['anmodning']
        }
      ]
    },
    additionalTitleParams: ['aar'],
    title: options => {
      return `I ${options.aar} har de botatt ${options.share}% av de de ble anmodet om.`
    },
    subTitle: options => {
      return `Gjennomsnittet i Norge er ${options.share}%`
    },
  }
]
