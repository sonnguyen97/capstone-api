/* eslint-disable */
import axios from 'axios'

const url = 'https://emm-api-server.herokuapp.com/'

// eslint-disable-next-line import/prefer-default-export
export async function getStatistics() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const statisticsUrl = `${url}/api/statistics/`
  return axios.get(statisticsUrl, config).then(result => {
    console.log('SERVICE getStatisticsResult', result.data)
    return result.data
  })
}
