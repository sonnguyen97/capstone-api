import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import { login } from 'services/user'
import { push } from 'react-router-redux'
import actions from './actions'
import { loadProfile, logout, register } from '../../services/user'
// import * as selectors from './selectors';

// import { loadProfile } from '../../services/user'

export function* LOGIN({ payload }) {
  const { storeDomain, password } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const success = yield call(login, storeDomain, password)
  if (success) {
    localStorage.setItem('token', success.token)
    localStorage.setItem('currentAccount', JSON.stringify(success.account))
    notification.success({
      message: 'Logged In',
      description: 'You have successfully logged in to Clean UI React Admin Template!',
    })
    yield put({
      type: 'user/LOAD_CURRENT_ACCOUNT',
    })
  }
  // yield put(push('/dashboard/alpha'));
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* REGISTER({ payload }) {
  const { email, password, storeName, storeDomain, roleId, statusId } = payload
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const success = yield call(register, email, password, storeName, storeDomain, roleId, statusId)
  if (success) {
    notification.success({
      message: 'Registered',
      description: 'You have successfully registered!',
    })
    yield put(push('/user/login'))
  }
}

export function* LOAD_CURRENT_ACCOUNT() {
  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: true,
    },
  })
  const response = yield call(loadProfile)
  if (response) {
    yield put({
      type: 'user/SET_STATE',
      payload: {
        id: response.id,
        email: response.email,
        last_modified_date: response.last_modified_date,
        store_name: response.store_name,
        store_domain: response.store_domain,
        role_id: response.role_id,
        status_id: response.status_id,
        authorized: true,
        role: response.Role.name,
      },
    })
    // yield put({
    //     type: 'user/LOAD_DASHBOARD',
    // })
  }

  yield put({
    type: 'user/SET_STATE',
    payload: {
      loading: false,
    },
  })
}

export function* LOGOUT() {
  yield call(logout)
  yield put({
    type: 'user/SET_STATE',
    payload: {
      id: '',
      email: '',
      last_modified_date: '',
      store_name: '',
      role_id: '',
      status_id: '',
      authorized: false,
    },
  })
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN, LOGIN),
    takeEvery(actions.LOAD_CURRENT_ACCOUNT, LOAD_CURRENT_ACCOUNT),
    takeEvery(actions.LOGOUT, LOGOUT),
    LOAD_CURRENT_ACCOUNT(), // run once on app load to check user auth
  ])
}
