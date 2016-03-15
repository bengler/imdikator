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
    title: params => {
      return `Innvandrere utgjorde i ${params.aar} ${params.share} av befolkningen`
    },
    subTitle: params => {
      return `For Norge var tallet ${params.share}`
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
    title: params => {
      return `Bosatte flyktninger per innbygger i ${params.aar}`
    },
    subTitle: params => {
      return `For hele landet er tallet ${params.share}`
    },
  },
  {
    name: 'anmodning_vedtak',
    query: {
      year: ['2012', '2013', '2014', '2015', '2016'],
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
    relevantFor: ['municipality', 'county', 'commerceRegion'],
    title: params => {
      return `Anmodning og vedtak om bosetting over tid`
    },
    subTitle: params => {
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
    title: params => {
      return `IMDi utbetalte ${params.share} i tilskudd i ${params.aar}`
    },
    subTitle: params => {
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
    additionalTitleParams: [],
    relevantFor: ['borough', 'municipality', 'county', 'commerceRegion'],
    title: params => {
      return `Deltakere som avsluttet introprogram i 2013 - andel i arbeid og utdanning i 2014`
    },
    subTitle: params => {
      return `Gjennomsnittet i Norge er ${params.share}`
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
    title: params => {
      return `${params.share} av ${params.innvkat3.replace('_', ' ')} var i arbeid i ${params.aar}`
    },
    subTitle: params => {
      return `For hele landet er tallet ${params.share}`
    },
  }
]
