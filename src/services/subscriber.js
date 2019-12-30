import axios from 'axios'

const url = 'https://emm-api-server.herokuapp.com/'
// eslint-disable-next-line import/prefer-default-export
export async function getSubscribers() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const getAll = `${url}/api/subscribers`
  return axios.get(getAll, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function createSubscriber(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const create = `${url}/api/subscribers`
  return axios.post(create, payload, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function getSubscriberTypes() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const getTypes = `${url}/api/subscriberTypes`
  return axios.get(getTypes, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function updateSubscriber(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const updateSub = `${url}/api/subscribers`
  return axios.put(updateSub, payload, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function deleteSubscriber(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const deleteSubscriberUrl = `${url}/api/subscribers/delete`
  return axios.put(deleteSubscriberUrl, payload, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function ImportExcel(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const imporExcel = `${url}/api/subscribers/importExcel`
  return axios.post(imporExcel, payload, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function MovingSubToAudience(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const movingSubToAudience = `${url}/api/subscribers/addingASubsctiberToAudience`
  return axios.post(movingSubToAudience, payload, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function UnsubscribeSubscriber(payload) {
  const config = {
    header: {
      'Content-Type': 'application/json',
    },
  }
  const deleteSubscriberUrl = `${url}/api/subscribers/unsubscribe`

  return axios.post(deleteSubscriberUrl, payload, config).then(result => {
    console.log(result.data)
    return result.data
  })
}
