import {
  TRACK_EVENT_CHRONOLOGICAL_TAB_OPEN,
  TRACK_EVENT_BENCHMARK_TAB_OPEN,
  TRACK_EVENT_REGION_COMPARE_OPEN,
  TRACK_EVENT_YEAR_CHANGED,
  TRACK_EVENT_BACKGROUND_CHANGED,
  TRACK_EVENT_GENDER_CHANGED,
  TRACK_EVENT_UNIT_CHANGED,
  TRACK_EVENT_OTHER_FILTERS_CHANGED,
  TRACK_EVENT_HELP_OPEN,
  TRACK_EVENT_CHART_LINK_OPEN,
  TRACK_EVENT_DOWNLOAD_COMPARE_SIMILAR,
  TRACK_EVENT_DOWNLOAD_COMPARE_ALL
} from './ActionTypes'


export function trackRegionCompareOpen() {
  return dispatch => {
    dispatch({type: TRACK_EVENT_REGION_COMPARE_OPEN})
  }
}

export function trackCronologicalTabOpen() {
  return dispatch => {
    dispatch({type: TRACK_EVENT_CHRONOLOGICAL_TAB_OPEN})
  }
}

export function trackBenchmarkTabOpen() {
  return dispatch => {
    dispatch({type: TRACK_EVENT_BENCHMARK_TAB_OPEN})
  }
}

export function trackYearChanged() {
  return dispatch => {
    dispatch({type: TRACK_EVENT_YEAR_CHANGED})
  }
}

export function trackBackgroundChanged() {
  return dispatch => {
    dispatch({type: TRACK_EVENT_BACKGROUND_CHANGED})
  }
}

export function trackGenderChanged() {
  return dispatch => {
    dispatch({type: TRACK_EVENT_GENDER_CHANGED})
  }
}

export function trackUnitChanged() {
  return dispatch => {
    dispatch({type: TRACK_EVENT_UNIT_CHANGED})
  }
}

export function trackOtherFiltersChanged() {
  return dispatch => {
    dispatch({type: TRACK_EVENT_OTHER_FILTERS_CHANGED})
  }
}

export function trackHelpOpen() {
  return dispatch => {
    dispatch({type: TRACK_EVENT_HELP_OPEN})
  }
}

export function trackChartLinkOpen() {
  return dispatch => {
    dispatch({type: TRACK_EVENT_CHART_LINK_OPEN})
  }
}

export function trackDownloadCompareSimilar() {
  return dispatch => {
    dispatch({type: TRACK_EVENT_DOWNLOAD_COMPARE_SIMILAR})
  }
}

export function trackDownloadCompareAll() {
  return dispatch => {
    dispatch({type: TRACK_EVENT_DOWNLOAD_COMPARE_ALL})
  }
}
