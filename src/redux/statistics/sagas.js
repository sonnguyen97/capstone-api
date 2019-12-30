/* eslint-disable */
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification, message } from 'antd'
import { getStatistics } from '../../services/statistics'

import actions from './actions'

export function* GET_STATISTICS() {
  // message.info({
  //   content: 'Please wait a moment! We are getting newsletters from database ...',
  // })
  yield put({
    type: 'statistics/SET_STATE',
    payload: {
      pageLoading: true,
    },
  })

  const getStatisticsResult = yield call(getStatistics)
  console.log('SAGAS getStatisticsResult', getStatisticsResult)

  if (!getStatisticsResult.success) {
    message.error({
      content: 'Failed to get statistics data in database',
    })
    yield put({
      type: 'statistics/SET_STATE',
      payload: {
        statistics: undefined,
      },
    })
  } else {
    const statistics = getStatisticsResult.statistics

    yield put({
      type: 'statistics/SET_STATE',
      payload: {
        statistics: statistics,
      },
    })
  }

  yield put({
    type: 'statistics/SET_STATE',
    payload: {
      pageLoading: false,
    },
  })
}

export default function* rootSaga() {
  yield all([takeEvery(actions.GET_STATISTICS, GET_STATISTICS)])
}
