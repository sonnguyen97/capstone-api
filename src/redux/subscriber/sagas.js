import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification, message } from 'antd'
import {
  UnsubscribeSubscriber,
  MovingSubToAudience,
  ImportExcel,
  deleteSubscriber,
  updateSubscriber,
  getSubscribers,
  createSubscriber,
  getSubscriberTypes,
} from '../../services/subscriber'
import actions from './actions'

// eslint-disable-next-line import/prefer-default-export
export function* GET_DATA_SUBSCRIBERS() {
  const subscribers = yield call(getSubscribers)
  console.log(subscribers)

  yield put({
    type: 'subscriber/SET_STATE',
    payload: {
      subscribers,
    },
  })
}

export function* CREATE_A_SUBSCRIBER({ payload }) {
  const Account = localStorage.getItem('currentAccount')
  const acc = JSON.parse(Account)
  const accountId = acc.id
  const { email, firstName, lastName, typeId, totalSpent, orderCount, cancelOrderTimes } = payload
  const body = {
    email,
    firstName,
    lastName,
    typeId,
    accountId,
    totalSpent,
    orderCount,
    cancelOrderTimes,
  }

  console.log(body)
  //  eslint-disable-next-line
  if (!email && !firstName && !lastName && !tagId && !accountId) {
    console.log(payload)
    console.log('Have some attribute undefined!')
  } else {
    const success = yield call(createSubscriber, JSON.stringify(body))
    if (success) {
      notification.success({
        message: 'Creating customer successfully!',
      })
    }
    if (!success) {
      notification.error({
        message: 'Creating customer failed!',
      })
    }
  }
}

export function* LOAD_SUBSCRIBER_TYPES() {
  const subscriberTypes = yield call(getSubscriberTypes)
  console.log(subscriberTypes)
  yield put({
    type: 'subscriber/SET_STATE',
    payload: {
      subscriberTypes,
    },
  })
}

export function* UPDATE_SUBSCRIBERS({ payload }) {
  // const { selectedRowKeys, typeId } = payload
  console.log(JSON.stringify(payload))
  const updateStatus = yield call(updateSubscriber, JSON.stringify(payload))
  if (updateStatus) {
    notification.success({
      message: 'Updated customer successfully!',
    })
  }
}

export function* DELETE_SUBSCRIBERS({ payload }) {
  // const { selectedRowKeys } = payload
  console.log(JSON.stringify(payload))
  const deleteStatus = yield call(deleteSubscriber, JSON.stringify(payload))
  if (deleteStatus) {
    notification.success({
      message: 'Deleted customer successfully!',
    })
  }
}

export function* IMPORT_EXCEL_SUBSCRIBERS({ payload }) {
  // const { selectedRowKeys } = payload
  console.log(JSON.stringify(payload))
  const check = yield call(ImportExcel, JSON.stringify(payload))
  if (check) {
    notification.success({
      message: 'Adding subscribers from file successfully!',
    })
  }
  if (!check) {
    notification.error({
      message: 'Adding subscribers from file error!',
    })
  }
}

export function* MOVING_SUBSCRIBER_TO_AUDIENCE({ payload }) {
  // const { selectedRowKeys } = payload
  console.log(JSON.stringify(payload))
  const check = yield call(MovingSubToAudience, JSON.stringify(payload))
  if (check) {
    notification.success({
      message: 'Moved subscrinbers to the audience!',
    })
  }
  if (!check) {
    notification.error({
      message: 'The subscriber already exists in this audience!',
    })
  }
}

export function* UNSUBSCRIBE({ payload }) {
  console.log('SAGAS SUBSCRIBER UNSUBSCRIBE payload', payload)
  message.info(' Thank you for using our service. We are processing your request ...')

  const unsubscribeResult = yield call(UnsubscribeSubscriber, payload)

  if (unsubscribeResult.success) {
    message.success(unsubscribeResult.message)
  } else {
    message.error('Something went wrong!')
  }
}

// const currNewsletter = payload
// console.log('SAGAS UPDATE NEWSLETTER currNewsletter', currNewsletter)

// if (updateStatus.success) {
//   notification.success({
//     message: `Email content saved succesfully`,
//   })
//   // window.location.reload()
// } else {
//   notification.error({
//     message: getResult.error,
//   })
// }

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_DATA_SUBSCRIBERS, GET_DATA_SUBSCRIBERS),
    takeEvery(actions.CREATE_A_SUBSCRIBER, CREATE_A_SUBSCRIBER),
    takeEvery(actions.LOAD_SUBSCRIBER_TYPES, LOAD_SUBSCRIBER_TYPES),
    takeEvery(actions.UPDATE_SUBSCRIBERS, UPDATE_SUBSCRIBERS),
    takeEvery(actions.DELETE_SUBSCRIBERS, DELETE_SUBSCRIBERS),
    takeEvery(actions.IMPORT_EXCEL_SUBSCRIBERS, IMPORT_EXCEL_SUBSCRIBERS),
    takeEvery(actions.MOVING_SUBSCRIBER_TO_AUDIENCE, MOVING_SUBSCRIBER_TO_AUDIENCE),
    takeEvery(actions.UNSUBSCRIBE, UNSUBSCRIBE),
  ])
}
