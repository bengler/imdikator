Imdikator frontend
==================

# Prerequisites

- Node.js (v0.10 or v0.12)
- npm (v2.x or later)

# Getting started

    npm install

    npm start

Now the app should be up and running on http://localhost:3000

# Resources
- [Imdi.no styleguide](http://imdi-no.protolife.no/styleguide)

# Preliminary API doc

API'et er tilgjengelig i et eget systemtestmiljø, der finnes det en egen WebApp med egne Collections i DocumentDB, en egne WebStorage-områder for opplasting og oppbevaring av filer.

- CORS-støtte er i orden fra alle origins, med gyldige headere.
- Opplasting av filer skjer asynkront fra selve parsingen av filene.
- camelCase i kolonnenavn er implementert
- implementert funksjonalitet for Exclude i spørringen mot API
- Exclude og Include kan ikke brukes samtidig
- Enten bruker man Include, eller Exclude
- Bruk av Exclude trenger et ekstra kall til JSON-dokumentene som blir lastet opp til DocumentDB
- Queues for WebJobs og StoredProcedure for BulkInsert lages når applikasjonen starter for å initiere verdier som trengs ved runtime
- Dashboard for å se progresjon og prosess til WebJobs finnes på https://imdikator-st.scm.azurewebsites.net/azurejobs/#/jobs/ (krever innlogging og tilgang i Azure - hvis ønskelig ta dette med Espen etter ferien)
- Opplasting av filer skjer ved: http://imdikator-st.azurewebsites.net/Home/UploadDatasetView
- Dette skal pusses videre på, slik at man får oversikt over hvilke filer som venter på parsing, og hvilke filer som er ferdige, samt funksjonalitet for å slette valgt tabell med fil.
- For øyeblikket er alle filene lastet opp og tilgjengelige via API

## API-endpoints:
- Oversikt over tabeller: http://imdikator-st.azurewebsites.net/api/v1/metadata/tables
- Oversikt over kolonnenavn i tabeller: http://imdikator-st.azurewebsites.net/api/v1/metadata/headers/<tabellnavn>
- Oversikt over kolonnenavn og hvilke verdier man kan spørre på for en tabell: http://imdikator-st.azurewebsites.net/api/v1/metadata/headerswithvalues/<tabellnavn> (uten < og >)
- Selve spørringen sendes som en POST-request til: http://imdikator-st.azurewebsites.net/api/v1/data/query

## Eksempel på spørring i tabell "introdeltakere":
```json
{
  "TableName": "introdeltakere",
  "Conditions": {
      "aar": [
          "2015"
      ],
      "bydelId": [
          "030101",
          "030102"
      ]
  },
  "Include": [
      "aar",
      "bydelId",
      "kjonn",
      "enhet",
      "tabellvariabel"
  ],
  "Exclude": []
}
```

Spørringen over vil ha identisk utfall med denne spørringen:

```json
{
  "TableName": "voksnevideregaende",
  "Conditions": {
      "aar": [
          "2015"
      ],
      "bydelId": [
          "030101",
          "030102"
      ]
  },
  "Include": [
  ],
  "Exclude": [
    "fylkeId",
    "kommuneId",
    "naringsregionId"
  ]
}
```

GUI for å teste API-kjapt finnes på: http://imdikator-st.azurewebsites.net/Home/Testing

Steg for å gjenskape spørringen over:
Velg tabell "introdeltakere" og trykk knappen "Get"
Scroll ned og merk "aar", "bydelId", "kjonn", "enhet" og "tabellvariabel" i øverste linje under "Choose headers and values"
Merk "2015" under "aar", "030101" og "030102" under "bydelId" og trykk knappen "Get"
Respons vil komme øverst, sammen med en framstilling av hvordan spørringen mot API-et ser ut.
Ved å merke av checkbox for "Format response?" vil responsen fra API-et bli formatert til et mer lesbart format.
