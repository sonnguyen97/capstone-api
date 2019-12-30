/* eslint-disable */
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification, message } from 'antd'
import { createEmailTemplate, getEmailTemplates } from '../../services/emailTemplate'

import actions from './actions'
// import * as selectors from './selectors'

export function* CREATE_EMAIL_TEMPLATE({ payload }) {
  message.info({
    content: 'Please wait a moment! We are creating your email template ...',
  })

  console.log('SAGAS CREATE EMAIL TEMPLATE emailTemplate', payload)

  const createResult = yield call(createEmailTemplate, payload)

  if (createResult.success) {
    message.success({
      content: 'Created email template successfully',
      // message: createResult.message,
    })
  } else {
    message.error({
      content: createResult.error,
    })
  }
}

export function* GET_EMAIL_TEMPLATES() {
  console.log('SAGAS GET EMAIL TEMPLATES')

  const getEmailTemplatesResult = yield call(getEmailTemplates)

  if (getEmailTemplatesResult.success) {
    yield put({
      type: 'emailTemplate/SET_STATE',
      payload: {
        emailTemplateList: getEmailTemplatesResult.emailTemplateList,
      },
    })
    // message.success({
    //   content: 'Created email template successfully',
    //   // message: createResult.message,
    // })
  } else {
    yield put({
      type: 'emailTemplate/SET_STATE',
      payload: {
        emailTemplateList: null,
      },
    })
    message.error({
      content: getEmailTemplatesResult.error,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.CREATE_EMAIL_TEMPLATE, CREATE_EMAIL_TEMPLATE),
    takeEvery(actions.GET_EMAIL_TEMPLATES, GET_EMAIL_TEMPLATES),
  ])
}
