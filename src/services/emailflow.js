/* eslint-disable */
import axios from 'axios'

const url = 'https://emm-api-server.herokuapp.com/'

export async function getEmailFlows() {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const getEmailFlowsUrl = `${url}/api/automation-flows/`
  return axios.get(getEmailFlowsUrl, config).then(result => {
    console.log('SERVICE getEmailFlowsResult', result.data)
    return result.data
  })
}

export async function getEmailFlowById(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const getEmailFlowByIdUrl = `${url}/api/automation-flows/${payload}`
  return axios.get(getEmailFlowByIdUrl, config).then(result => {
    console.log('SERVICE getEmailFlowByIdResult', result.data)
    return result.data
  })
}

export async function createEmailFlow(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const createEmailFlowUrl = `${url}/api/automation-flows/`
  return axios.post(createEmailFlowUrl, payload, config).then(result => {
    console.log('SERVICE createEmailFlowResult', result.data)
    return result.data
  })
}

export async function updateEmailFlow(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const updateEmailFlowUrl = `${url}/api/automation-flows/`
  return axios.put(updateEmailFlowUrl, payload, config).then(result => {
    console.log('SERVICE updateEmailFlowResult', result.data)
    return result.data
  })
}

export async function startEmailFlow(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const startEmailFlowUrl = `${url}/api/automation-flows/status`
  return axios.put(startEmailFlowUrl, payload, config).then(result => {
    console.log('SERVICE startEmailFlow', result.data)
    return result.data
  })
}

export async function deleteEmailFlows(payload) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  console.log('DELETE_EMAIL_FLOWS payload', payload)

  const updateEmailFlowUrl = `${url}/api/automation-flows/delete`
  return axios.put(updateEmailFlowUrl, payload.selectedRowKeys, config).then(result => {
    console.log('SERVICE updateEmailFlowResult', result.data)
    return result.data
  })
}
