import axios from 'axios'

const url = 'https://emm-api-server.herokuapp.com/'

export async function getAccount() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const getAll = `${url}/api/admin`
  return axios.get(getAll, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function getRolesTypes() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const getTypes = `${url}/api/RolesTypes`
  return axios.get(getTypes, config).then(result => {
    console.log(result.data)
    return result.data
  })
}
