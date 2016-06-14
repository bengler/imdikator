import {
  TRACK_EVENT_CHRONOLOGICAL_TAB_OPEN,
  TRACK_EVENT_BENCHMARK_TAB_OPEN,
  TRACK_EVENT_REGION_COMPARE_OPEN,
  TRACK_EVENT_YEAR_OPEN,
  TRACK_EVENT_BACKGROUND_OPEN,
  TRACK_EVENT_GENDER_OPEN,
  TRACK_EVENT_UNIT_OPEN,
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

export function trackYearOpen() {
  return dispatch => {
    dispatch({type: TRACK_EVENT_YEAR_OPEN})
  }
}

export function trackBackgroundOpen() {
  return dispatch => {
    dispatch({type: TRACK_EVENT_BACKGROUND_OPEN})
  }
}

export function trackGenderOpen() {
  return dispatch => {
    dispatch({type: TRACK_EVENT_GENDER_OPEN})
  }
}

export function trackUnitOpen() {
  return dispatch => {
    dispatch({type: TRACK_EVENT_UNIT_OPEN})
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
