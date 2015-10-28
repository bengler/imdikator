#!/usr/bin/env bash

TABLES=(
  arbledige_innvkat_land
  befolkning_botid
  barnehagedeltakelse
  befolkning_innvandringsgrunn
  bosatt_anmodede
  bosatt_befolkning
  befolkning_verdensregion
  flyktning_botid_flytting
  gjennomsnittsinntekt
  bosatt_vedtak
  bosetting
  ikke_arbutd_innvkat_land
  ikke_arbutd_innvkat_alder
  intro_deltakere
  befolkning_hovedgruppe_tidsserie
  norsk_deltakere
  sysselsatte_botid
  sosialhjelp
  intro_avslutning_direkte
  sysselsatte_innvkat
  sysselsatte_botid_land
  sysselsatte_kjonn_land
  sysselsatte_land
  sysselsatte_innvkat_alder
  sysselsatte_innvandringsgrunn
  vedvarende_lavinntekt
  tilskudd
  ungdom_utenfor_opplaring
  videregaende_deltakelse
  voksne_videregaende
  voksne_grunnskole
  befolkning_opprinnelsesland
  befolkning_hovedgruppe
  norsk_prover
  befolkning_alder
  befolkning_flytting
  befolkning_flytting_vreg
  befolkning_verdensregion_9
  befolkning_verdensregion_6
  befolkning_verdensregion_3
  grunnskolepoeng
  intro_avslutning_direkte_3
  intro_avslutning_direkte_8
  utdanningsniva
  videregaende_fullfort
  intro_status_arbutd
  bosetting_maaned
)

for TABLE in "${TABLES[@]}"
do
  ab -n 100 -c 10 "http://imdikator-st.azurewebsites.net/api/v1/metadata/headergroups/$TABLE"
done
