import axios from 'axios'

const url = 'https://emm-api-server.herokuapp.com/'
// eslint-disable-next-line import/prefer-default-export
export async function getAllCampaigns() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const getAll = `${url}/api/campaigns`
  return axios.get(getAll, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function createAutomatedCampaign(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const create = `${url}/api/campaigns`
  return axios.post(create, payload, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function getAutomatedCampaign() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const create = `${url}/api/campaigns/automated-campaign`
  return axios.get(create, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function changeOperationStatusAutomatedCampaign(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const changeStatus = `${url}/api/campaigns/changeOperationStatusAutomatedCampaign`
  return axios.post(changeStatus, payload, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function deleteCampaigns(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const deleteCamp = `${url}/api/campaigns/deleteCampaigns`
  return axios.put(deleteCamp, payload, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function createCampaign(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const create = `${url}/api/campaigns`
  return axios.post(create, payload, config).then(result => {
    console.log(`111 + ${result.data}`)
    return result.data
  })
}

export async function updateCampaign(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const create = `${url}/api/campaigns`
  return axios.put(create, payload, config).then(result => {
    console.log(`111 + ${result.data}`)
    return result.data
  })
}

export async function createCampaignAfterSaveName(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const create = `${url}/api/campaigns/create`
  return axios.put(create, payload, config).then(result => {
    console.log(`111 + ${result.data}`)
    return result.data
  })
}

export async function getCampaignById(id) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const create = `${url}/api/campaigns/campaign/${id}`
  return axios.get(create, config).then(result => {
    console.log(`${result.data}`)
    return result.data
  })
}

export async function changeOperationStatusCampaign(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const changeStatus = `${url}/api/campaigns/changeOperationStatusCampaign`
  return axios.post(changeStatus, payload, config).then(result => {
    console.log(result.data)
    return result.data
  })
}
