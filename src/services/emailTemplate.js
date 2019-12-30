/* eslint-disable */
import axios from 'axios'

const url = 'https://emm-api-server.herokuapp.com/'

export async function createEmailTemplate(payload) {
  const config = {
    header: {
      'Content-Type': 'application/json',
    },
  }

  console.log('SERVICE CREATE EMAIL TEMPLATE emailTemplate', payload)

  const createEmailTemplateUrl = `${url}/api/emails/templates/create`

  return axios.post(createEmailTemplateUrl, payload, config).then(result => {
    console.log('SERVICE createEmailTemplateResult', result.data)
    return result.data
  })
}

export async function getEmailTemplates(payload) {
  const config = {
    header: {
      'Content-Type': 'application/json',
    },
  }

  // console.log('SERVICE GET EMAIL TEMPLATEs emailTemplate', payload)

  const getEmailTemplatesUrl = `${url}/api/emails/templates/getAll`

  return axios.get(getEmailTemplatesUrl, payload, config).then(result => {
    console.log('SERVICE getEmailTemplatesResult', result.data)
    return result.data
  })
}
