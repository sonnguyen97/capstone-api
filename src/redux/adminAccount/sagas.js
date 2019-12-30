import { all, takeEvery, put, call } from 'redux-saga/effects'
import { getAccount, getRolesTypes } from '../../services/adminAccount'

// import * as selectors from './selectors'
import actions from './actions'

// eslint-disable-next-line import/prefer-default-export
export function* GET_DATA_ACCOUNTS() {
  const accounts = yield call(getAccount)

  const roles = yield call(getRolesTypes)
  console.log(accounts)

  yield put({
    type: 'adminAccount/SET_STATE',
    payload: {
      accounts,
      roles,
    },
  })
}

export default function* rootSaga() {
  yield all([takeEvery(actions.GET_DATA_ACCOUNTS, GET_DATA_ACCOUNTS)])
}
