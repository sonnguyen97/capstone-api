import axios from 'axios'

const url = 'https://emm-api-server.herokuapp.com/'
// eslint-disable-next-line import/prefer-default-export
export async function getTags(AccountID) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const getAll = `${url}/api/tags/${AccountID}`
  return axios.get(getAll, config).then(result => {
    console.log(result.data)
    return result.data
  })
}

export async function createTag(Tag) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const CreateTag = `${url}/api/tags`
  return axios.post(CreateTag, Tag, config).then(result => {
    console.log(result.data)
    return result.data
  })
}
