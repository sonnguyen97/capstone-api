import axios from 'axios'

const url = 'https://emm-api-server.herokuapp.com/'
// eslint-disable-next-line import/prefer-default-export
export async function getCriterionType() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const getAll = `${url}/api/criteria`
  return axios.get(getAll, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function getDefinitionAudience() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const definition = `${url}/api/criteria/definition`
  return axios.get(definition, config).then(result => {
    console.log(result.data)
    return result.data
  })
}
