import apiClient from '../config/apiClient'

export const REQUEST_CHART_DATA = 'REQUEST_CHART_DATA'
export const RECEIVE_CHART_DATA = 'RECEIVE_CHART_DATA'

export function loadChartData(regionCode, chartType) {
  return (dispatch, state) => {
    dispatch({
      type: REQUEST_CHART_DATA,
      regionCode: regionCode,
      chartType: chartType
    })
    return apiClient.getTheData()
      .then(data => {
        dispatch({
          type: RECEIVE_CHART_DATA,
          chartData: data
        })
      })
  }
}
