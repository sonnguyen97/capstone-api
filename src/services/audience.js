import axios from 'axios'

const url = 'https://emm-api-server.herokuapp.com/'
// eslint-disable-next-line import/prefer-default-export
export async function createAAudience(body) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const createaaudience = `${url}/api/audience`
  return axios.post(createaaudience, body, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function getAudience() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const getAudienceUrl = `${url}/api/audience`
  return axios.get(getAudienceUrl, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function getAudienceDetail(id) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const getAudienceUrl = `${url}/api/audience/${id}`
  return axios.get(getAudienceUrl, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function deleteAudience(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const deleteAudienceUrl = `${url}/api/audience/delete`
  return axios.put(deleteAudienceUrl, payload, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function getDefinitionAudience(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const getDefinitionAudienceUrl = `${url}/api/audience/definition-audience`
  return axios.put(getDefinitionAudienceUrl, payload, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function getAudienceSubscribers(audienceId) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const getAudienceSubscribersUrl = `${url}/api/audience/subscribers/${audienceId}`
  return axios.get(getAudienceSubscribersUrl, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function removeSubscriberOurOfAudience(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const removeSubOutOfAudienceUrl = `${url}/api/audience/removeSubscribers`
  return axios.put(removeSubOutOfAudienceUrl, payload, config).then(result => {
    console.log(result.data)
    return result.data
  })
}
