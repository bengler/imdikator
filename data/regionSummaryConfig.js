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
    additionalTitleParams: ['aar'],
    relevantFor: ['borough', 'municipality', 'county', 'commerceRegion'],
    title: options => {
      return `Innvandrere utgjorde i ${options.aar} ${options.share} av befolkningen`
    },
    subTitle: options => {
      return `For Norge var tallet ${options.share}`
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
      return `Bosatte ${options.share} flyktninger per innbygger i ${options.aar}`
    },
    subTitle: options => {
      return `For hele landet er tallet ${options.share}`
    },
  },
  {
    name: 'anmodning_vedtak',
    query: {
      year: 'all',
      tableName: 'bosatt_anmodede',
      unit: ['personer'],
      dimensions: [
        {
          name: 'bosetting',
          variables: ['anmodning', 'vedtak']
        }
      ]
    },
    drillDown: {
      page: 'befolkning',
      card: 'bosatt_anmodede',
      buttonTitle: 'Gå til bosettingsstatistikk'
    },
    chartKind: 'line',
    compareWithSimilarRegions: false,
    additionalTitleParams: [],
    relevantFor: ['borough', 'municipality', 'county', 'commerceRegion'],
    title: options => {
      return `Anmodning og vedtak om bosetting over tid`
    },
    subTitle: options => {
      return null
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
      return `IMDi utbetalte ${options.share} i tilskudd i ${options.aar}`
    },
    subTitle: options => {
      return null
    },
  },
  {
    name: 'innvandrere_intro_arbeid',
    query: {
      year: 'latest',
      tableName: 'intro_status_arbutd',
      unit: ['prosent'],
      dimensions: [
        {
          name: 'avslutta',
          variables: ['ettaar']
        },
        {
          name: 'avslstat4',
          variables: ['arbutd']
        },
        {
          name: 'kjonn',
          variables: ['alle']
        }
      ]
    },
    drillDown: {
      page: 'kvalifisering',
      card: 'status-etter-intro',
      buttonTitle: 'Gå til resultater fra introprogrammet'
    },
    chartKind: 'benchmark',
    compareWithSimilarRegions: true,
    additionalTitleParams: ['aar'],
    relevantFor: ['borough', 'municipality', 'county', 'commerceRegion'],
    title: options => {
      return `I ${options.aar} var ${options.share} av deltakerne som avsluttet intro året før i arbeid eller utdanning`
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
    additionalTitleParams: ['innvkat3', 'aar'],
    relevantFor: ['borough', 'municipality', 'county', 'commerceRegion'],
    title: options => {
      return `${options.share} av ${options.innvkat3.replace('_', ' ')} var i arbeid i ${options.aar}`
    },
    subTitle: options => {
      return `For hele landet er tallet ${options.share}`
    },
  }
]
