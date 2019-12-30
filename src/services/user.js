// import { all, takeEvery, put, call, select } from 'redux-saga/effects'
import axios from 'axios'
import { notification } from 'antd'

// eslint-disable-next-line import/prefer-default-export
const url = 'https://emm-api-server.herokuapp.com/'
export async function login(storeDomain, password) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  // const state = stateShop
  const body = JSON.stringify({ storeDomain, password })

  return axios
    .post(`${url}/api/auth/login`, body, config)
    .then(result => {
      return result.data
    })
    .catch(() => {
      notification.warning({
        message: 'Login Failed',
        description: 'Invalid store domain or password',
      })
    })
}
export async function loadProfile() {
  const setAuthToken = token => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token
    } else {
      delete axios.defaults.headers.common['x-auth-token']
    }
  }
  if (localStorage.token) {
    setAuthToken(localStorage.token)
    return axios.get(`${url}/api/accounts/me`).then(result => {
      return result.data
    })
  }
  return false
}

// eslint-disable-next-line camelcase
export async function register(email, password, store_name, store_domain, role_id, status_id) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  // const state = stateShop
  const body = JSON.stringify({ email, password, store_name, store_domain, role_id, status_id })
  return (
    axios
      .post(`${process.env.url}/api/user`, body, config)
      // .then(() => {
      //   const url = `${process.env.url}/api/shopify/addScript`
      //   return axios.get(url, {
      //     params: {
      //       shop, hmac, code, state
      //     }
      //   })
      .then(result => {
        return result
      })
      .catch(() => {
        notification.warning({
          message: 'Register Failed',
        })
      })
      // })
      .catch(() => {
        notification.warning({
          message: 'Register Failed',
        })
      })
  )
}

export async function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('currentAccount')
}
