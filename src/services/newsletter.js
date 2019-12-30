import axios from 'axios'

const url = 'https://emm-api-server.herokuapp.com/'

// eslint-disable-next-line import/prefer-default-export
export async function getNewsletters() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const newslettersUrl = `${url}/api/newsletters`
  return axios.get(newslettersUrl, config).then(result => {
    console.log('SERVICE getNewslettersResult', result.data)
    return result.data
  })
}

export async function createNewsletter(payload) {
  const config = {
    header: {
      'Content-Type': 'application/json',
    },
  }

  const createNewsletterUrl = `${url}/api/newsletters`

  return axios.post(createNewsletterUrl, payload, config).then(result => {
    console.log('SERVICE getNewslettersResult', result.data)
    return result.data
  })
}

export async function getNewsletterById(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const newslettersUrl = `${url}/api/newsletters/${payload}`
  return axios.get(newslettersUrl, config).then(result => {
    console.log('SERVICE getNewsletterByIdResult', result.data)
    return result.data
  })
}

export async function deleteNewsletters(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const deletedNewslettersUrl = `${url}/api/newsletters/delete`

  return axios.put(deletedNewslettersUrl, payload, config).then(result => {
    console.log('SERVICE deleteNewsletters', result.data)
    return result.data
  })
}

export async function updateNewsletter(payload) {
  const config = {
    header: {
      'Content-Type': 'application/json',
    },
  }
  const updateNewsletterUrl = `${url}/api/newsletters/update/`

  return axios.put(updateNewsletterUrl, payload, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function getAllAudience() {
  const config = {
    header: {
      'Content-Type': 'application/json',
    },
  }
  const getAllAudienceUrl = `${url}/api/newsletters/audience/getAll`

  return axios.get(getAllAudienceUrl, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function sendmail(payload) {
  const config = {
    header: {
      'Content-Type': 'application/json',
    },
  }

  const sendmailUrl = `${url}/api/newsletters/send/newsletter`

  return axios
    .post(sendmailUrl, payload, config)
    .then(result => {
      return result.data
    })
    .catch(error => {
      return error
    })
}

export async function getEmailById(payload) {
  const config = {
    header: {
      'Content-Type': 'application/json',
    },
  }
  const getEmailURL = `${url}/api/emails/${payload}`
  console.log(`Services: ${payload}`)
  return axios.get(getEmailURL, payload, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

// eslint-disable-next-line
// export async function updateNewsletterAudience(payload) {
//   const config = {
//     header: {
//       'Content-Type': 'application/json',
//     },
//   }

//   const updateNewsletterAudienceUrl = `${url}/api/newsletters/audience/update`
//   return axios.post(updateNewsletterAudienceUrl, payload, config).then(result => {
//     console.log(result.data)
//     return result.data
//   })
//   // .catch(error => {
//   //   console.log(error)
//   //   return error
//   // })
// }
