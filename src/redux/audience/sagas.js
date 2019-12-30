import { all, call, put, takeEvery } from 'redux-saga/effects'
import { notification } from 'antd'
import actions from './actions'
import {
  removeSubscriberOurOfAudience,
  getAudienceSubscribers,
  getDefinitionAudience,
  deleteAudience,
  getAudienceDetail,
  getAudience,
  createAAudience,
} from '../../services/audience'

export function* CREATE_A_AUDIENCE({ payload }) {
  // criterionItem.audienceName = payload.audienceName
  console.log(JSON.stringify(payload))

  const audiecenIdRes = yield call(createAAudience, JSON.stringify(payload))
  if (audiecenIdRes) {
    localStorage.removeItem('audienceDetail')
    localStorage.setItem('audienceDetail', JSON.stringify(audiecenIdRes))
    yield put({
      type: 'audience/SET_STATE',
      payload: { audienceDetail: audiecenIdRes },
    })
    notification.success({
      message: 'Creating audience successfully',
    })
  } else {
    notification.error({
      message: 'Creating audience failed',
    })
  }
}

export function* GET_AUDIENCE() {
  const audienceData = yield call(getAudience)
  yield put({
    type: 'audience/SET_STATE',
    payload: {
      audienceData,
    },
  })
}

export function* GET_AUDIENCE_DETAIL({ payload }) {
  const { audienceId } = payload
  const audienceDetail = yield call(getAudienceDetail, audienceId)
  localStorage.removeItem('audienceDetail')
  localStorage.setItem('audienceDetail', JSON.stringify(audienceDetail))
  yield put({
    type: 'audience/SET_STATE',
    payload: {
      audienceDetail,
      audienceId,
    },
  })
}

export function* DELETE_AUDIENCE({ payload }) {
  // const { selectedRowKeys } = payload
  console.log(JSON.stringify(payload))
  const deleteStatus = yield call(deleteAudience, JSON.stringify(payload))
  if (deleteStatus) {
    notification.success({
      message: 'Deleted audience successfully!',
    })
  }
  if (!deleteStatus) {
    notification.error({
      message:
        'Audience having subscribers. Can not deleted! Please delete the subscribers before delete the audience!',
    })
  }
}

export function* GET_DEFINITION_AUDIENCE({ payload }) {
  console.log(JSON.stringify(payload))
  const deleteStatus = yield call(getDefinitionAudience, JSON.stringify(payload))
  if (deleteStatus) {
    notification.success({
      message: 'Deleted audience successfully!',
    })
  }
}

export function* GET_AUDIENCE_SUBSCRIBERS({ payload }) {
  const { audienceId } = payload

  localStorage.setItem('audienceId', audienceId)
  console.log(JSON.stringify(payload))
  const audienceDetail = yield call(getAudienceSubscribers, audienceId)
  localStorage.removeItem('audienceDetail')
  localStorage.setItem('audienceDetail', JSON.stringify(audienceDetail))
  yield put({
    type: 'audience/SET_STATE',
    payload: {
      audienceDetail,
      audienceId,
    },
  })
}

export function* REMOVE_SUBSCRIBER_OUT_OF_AUDIENCE({ payload }) {
  console.log(JSON.stringify(payload))
  const { audienceId } = payload
  const status = yield call(removeSubscriberOurOfAudience, JSON.stringify(payload))
  if (status) {
    const audienceDetail = yield call(getAudienceSubscribers, audienceId)
    yield put({
      type: 'audience/SET_STATE',
      payload: {
        audienceDetail,
        audienceId,
      },
    })
    notification.success({
      message: 'Removed subscribers out of the audience!',
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CREATE_A_AUDIENCE, CREATE_A_AUDIENCE),
    takeEvery(actions.GET_AUDIENCE, GET_AUDIENCE),
    takeEvery(actions.GET_AUDIENCE_DETAIL, GET_AUDIENCE_DETAIL),
    takeEvery(actions.DELETE_AUDIENCE, DELETE_AUDIENCE),
    takeEvery(actions.GET_DEFINITION_AUDIENCE, GET_DEFINITION_AUDIENCE),
    takeEvery(actions.GET_AUDIENCE_SUBSCRIBERS, GET_AUDIENCE_SUBSCRIBERS),
    takeEvery(actions.REMOVE_SUBSCRIBER_OUT_OF_AUDIENCE, REMOVE_SUBSCRIBER_OUT_OF_AUDIENCE),
  ])
}
