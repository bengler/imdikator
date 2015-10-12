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
    chartKind: 'benchmark',
    compareRegionToSimilar: true,
    additionalTitleParams: [],
    title: options => {
      return `Innvandrere utgjør ${options.share}% av befolkningen`
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
    chartKind: 'benchmark',
    compareRegionToSimilar: true,
    additionalTitleParams: [],
    title: options => {
      return `Flyktninger utgjør ${options.share}‰ av befolkningen`
    },
    subTitle: options => {
      return `For hele landet er tallet ${options.share}‰`
    },
  },
  {
    name: 'bosatt_anmodede',
    query: {
      year: 'latest',
      tableName: 'bosatt_anmodede',
      unit: 'prosent',
      dimensions: [
        {
          name: 'bosetting',
          variables: ['bosatt']
        }
      ]
    },
    chartKind: 'benchmark',
    compareRegionToSimilar: true,
    additionalTitleParams: ['aar'],
    title: options => {
      return `I ${options.aar} har de bosatt ${options.share}% av de de ble anmodet om.`
    },
    subTitle: options => {
      return `Gjennomsnittet i Norge er ${options.share}%`
    },
  },
  {
    name: 'i_arbeid',
    query: {
      year: 'latest',
      tableName: 'sysselsatte_innvkat',
      unit: 'prosent',
      dimensions: [
        {
          name: 'innvkat3',
          variables: ['innvandrere', 'befolkningen_ellers']
        }
      ]
    },
    chartKind: 'bar',
    compareRegionToSimilar: false,
    additionalTitleParams: ['innvkat3'],
    title: options => {
      return `${options.share}% av ${options.innvkat3.replace('_', ' ')} er i arbeid`
    },
    subTitle: options => {
      return `For hele landet er tallet ${options.share}%`
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
    chartKind: 'benchmark',
    compareRegionToSimilar: true,
    additionalTitleParams: [],
    title: options => {
      return `${options.share}% av innvandrerne går direkte fra introprogram til arbeid/utdanning`
    },
    subTitle: options => {
      return `Gjennomsnittet i Norge er ${options.share}%`
    },
  }
]