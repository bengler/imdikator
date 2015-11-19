export default [
  {
    name: 'befolkning_hovedgruppe',
    query: {
      year: 'latest',
      tableName: 'befolkning_hovedgruppe',
      unit: ['prosent'],
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
    drillDown: {
      page: 'befolkning',
      card: 'befolkning_hovedgruppe',
      buttonTitle: 'Gå til befolkningssammensetning'
    },
    chartKind: 'benchmark',
    compareWithSimilarRegions: true,
    additionalTitleParams: [],
    relevantFor: ['borough', 'municipality', 'county', 'commerceRegion'],
    title: options => {
      return `Innvandrere utgjør ${options.share} av befolkningen`
    },
    subTitle: options => {
      return `For Norge er tallet ${options.share}`
    }
  },
  {
    name: 'flyktninger_befolkningsandel',
    query: {
      year: 'latest',
      tableName: 'bosatt_befolkning',
      unit: ['promille'],
      dimensions: [
        {
          name: 'bosetting',
          variables: ['bosatt_per_1000']
        }
      ]
    },
    drillDown: {
      page: 'befolkning',
      card: 'flyktninger_befolkningsandel',
      buttonTitle: 'Gå til andel bosatte'
    },
    chartKind: 'benchmark',
    compareWithSimilarRegions: true,
    additionalTitleParams: ['aar'],
    relevantFor: ['borough', 'municipality', 'county', 'commerceRegion'],
    title: options => {
      return `Bosatte ${options.share} flyktninger per tusen innbygger i år ${options.aar}`
    },
    subTitle: options => {
      return `For hele landet er tallet ${options.share}`
    },
  },
  {
    name: 'tilskudd',
    query: {
      year: 'latest',
      tableName: 'tilskudd',
      unit: ['kroner'],
      dimensions: [
        {
          name: 'tilskuddTilKommuner',
          variables: ['totalt']
        }
      ]
    },
    drillDown: {
      page: 'tilskudd',
      card: 'tilskudd',
      buttonTitle: 'Gå til tilskudd'
    },
    chartKind: 'benchmark',
    compareWithSimilarRegions: true,
    additionalTitleParams: ['aar'],
    relevantFor: ['municipality', 'county', 'commerceRegion'],
    title: options => {
      return `Mottok ${options.share} i tilskudd fra IMDi i år ${options.aar}`
    },
    subTitle: options => {
      return null
    },
  },
  {
    name: 'innvandrere_intro_arbied',
    query: {
      year: 'latest',
      tableName: 'intro_avslutning_direkte',
      unit: ['prosent'],
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
    drillDown: {
      page: 'kvalifisering',
      card: 'etter-intro',
      buttonTitle: 'Gå til resultater fra introprogrammet'
    },
    chartKind: 'benchmark',
    compareWithSimilarRegions: true,
    additionalTitleParams: [],
    relevantFor: ['borough', 'municipality', 'county', 'commerceRegion'],
    title: options => {
      return `${options.share} av innvandrerne går direkte fra introprogram til arbeid/utdanning`
    },
    subTitle: options => {
      return `Gjennomsnittet i Norge er ${options.share}`
    },
  },
  {
    name: 'i_arbeid',
    query: {
      year: 'latest',
      tableName: 'sysselsatte_innvkat',
      unit: ['prosent'],
      dimensions: [
        {
          name: 'innvkat3',
          variables: ['innvandrere', 'befolkningen_ellers']
        }
      ]
    },
    drillDown: {
      page: 'arbeid',
      card: 'sysselsatte-innvkat',
      buttonTitle: 'Gå til sysselsetting'
    },
    chartKind: 'bar',
    compareWithSimilarRegions: false,
    additionalTitleParams: ['innvkat3'],
    relevantFor: ['borough', 'municipality', 'county', 'commerceRegion'],
    title: options => {
      return `${options.share} av ${options.innvkat3.replace('_', ' ')} er i arbeid`
    },
    subTitle: options => {
      return `For hele landet er tallet ${options.share}`
    },
  }
]
