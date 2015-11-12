---
title: Embedding av indikator
layout: default
---

# Embedding av indikator

Her finner du en spesifikasjon av hva som kreves for å embedde både indikator-appen og enkeltstående embeds.

# Script-tagg
Script-taggen laster imdikator-loader.js asynkront uten å blokkere og bør inkluderes så tidlig som mulig i DOM-treet.

## Eksempel

Script-tagg som laster imdikator på polkaposten.

```html
<script type="text/javascript"
  src="http://imdikator.o5.no/build/js/imdikator-loader.js"
  id="imdikator-loader"
  async
  defer>
</script>
```

## Spesifikasjon attributter
### `src="<url til imdikator-loader.js>"` (påkrevd)

- For servere i produksjon skal dette være: `http://amedia.o5.no/api/imdikator/v1/js/imdikator-loader.js`
- For staging/testservere skal dette være: `http://amedia.staging.o5.no/api/imdikator/v1/js/imdikator-loader.js`

### `id="imdikator-loader"`  (påkrevd)
Eneste gyldige verdi er `imdikator-loader`

### `async` og `defer`
Disse to attributtene forteller nettleseren at scriptet kan lastes inn asynkront og vil dermed ikke blokkere lasting av andre script på siden.

# Placeholder for imdikator-siden

Taggen plasseres i DOM-treet der man ønsker at imdikator-siten skal vises.

### Eksempel
```html
<div data-imdikator="site"></div>
```

# Placeholder for embeds

Script-taggen over må inkluders på alle sider som skal ha mulighet til å vise embeds

### Spesifikasjon

```html
<div data-imdikator="embed">
  <script type="application/json">
    [JSON-config]
  </script>
  [innhold som vises før embedden er ferdig lastet]
</div>
```


### Eksempel
```html
<div data-imdikator="embed">
  <script type="application/json">
    {
      "version": 1,
      "url": "http://imdi.no/indikator/steder/F00/arbeid/sysselsetting-alder-innvkat"
    }
  </script>
  Henter figur…
</div>
```

## Spesifikasjon json-config

Foreløpig støttes det kun å embedde vha en url til en figur i indikator-løsningen, så config-objektet har kun to properties, `version` og `url`

URL kan inneholde `hostname`, men dette blir ignorert

### `data-imdikator="site"` (påkrevd)
Eneste gyldige verdi er `imdikator`

# Endringslogg

- 12.11.2015: Dette dokumentet opprettet
