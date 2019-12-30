/* eslint-disable */
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification, message } from 'antd'
import {
  getEmailFlows,
  getEmailFlowById,
  updateEmailFlow,
  deleteEmailFlows,
} from '../../services/emailflow'

import actions from './actions'

const ConditionType = {
  CLICKED: {
    id: '9b4eafbf-89c2-47c8-b4d1-2079a1984457',
    name: 'Clicked',
    description: 'Recipient has clicked in any link in the e-mail yet?',
  },
  OPENED: {
    id: '53935626-0108-46d6-9b1b-eca69da88ff5',
    name: 'Opened',
    description: 'Recipient has opened e-mail yet?',
  },
}

const EmailFlowOperationStatus = {
  AVAILABLE: {
    id: '66691239-62eb-4d32-a003-c47aa61e5ab9',
    name: 'Available',
  },
  DELETED: {
    id: 'dfcd7682-b63c-4444-9890-44abe0fc8c30',
    name: 'Deleted',
  },
  RUNNING: {
    id: 'a960e1ac-d8bc-4e8f-855d-4206458b8030',
    name: 'Running',
  },
}

export function* GET_EMAIL_FLOWS() {
  // message.info({
  //   content: 'Please wait a moment! We are getting newsletters from database ...',
  // })
  yield put({
    type: 'emailFlow/SET_STATE',
    payload: {
      pageLoading: true,
    },
  })

  const getEmailFlowsResult = yield call(getEmailFlows)
  console.log('SAGAS getEmailFlowsResult', getEmailFlowsResult)

  if (!getEmailFlowsResult.success) {
    message.error({
      content: 'Failed to get email flows data in database',
    })
    yield put({
      type: 'emailFlow/SET_STATE',
      payload: {
        emailFlows: undefined,
      },
    })
  } else {
    const emailFlows = getEmailFlowsResult.emailFlows
    message.info({
      content: 'Get all email flows from database successfully',
    })
    yield put({
      type: 'emailFlow/SET_STATE',
      payload: {
        emailFlows: emailFlows,
      },
    })
  }

  yield put({
    type: 'emailFlow/SET_STATE',
    payload: {
      pageLoading: false,
    },
  })
}

export function* GET_EMAIL_FLOW_BY_ID({ payload }) {
  yield put({
    type: 'emailFlow/SET_STATE',
    payload: {
      pageLoading: true,
    },
  })

  // message.info({
  //   content: 'Please wait a moment! We are getting selected email flow from database ...',
  // })

  const { selectedEmailFlowId } = payload
  console.log('SAGAS GET EMAIL FLOW BY ID payloadChecking', selectedEmailFlowId)
  const getResult = yield call(getEmailFlowById, selectedEmailFlowId)

  if (getResult.success) {
    // Set to LocalStorage
    localStorage.setItem('currEmailFlow', JSON.stringify(getResult.currEmailFlow))

    // Set to props
    yield put({
      type: 'emailFlow/SET_STATE',
      payload: {
        currEmailFlow: getResult.currEmailFlow,
        handlingStatus: {
          create: false,
          edit: true,
        },
      },
    })

    yield put({
      type: 'emailFlow/SET_STATE',
      payload: {
        pageLoading: false,
      },
    })

    // message.success({
    //   content: 'Your email flow has recovered successfully',
    //   // content: getResult.message,
    // })
  } else {
    message.error({
      content: getResult.error,
    })
  }
}

export function* CREATE_EMAIL_FLOW({ payload }) {
  yield put({
    type: 'emailFlow/SET_STATE',
    payload: {
      pageLoading: true,
    },
  })

  // message.info({
  //   content: 'Please wait a moment! We are getting selected email flow from database ...',
  // })

  switch (payload.stepSequence.nextStep.conditionType.name) {
    case ConditionType.OPENED.name:
      payload.stepSequence.nextStep.conditionType.id = ConditionType.OPENED.id
      break
    case ConditionType.CLICKED.name:
      payload.stepSequence.nextStep.conditionType.id = ConditionType.CLICKED.id
      break
    default:
      null
  }

  // const { selectedEmailFlowId } = payload
  console.log('SAGAS CREATE EMAIL FLOW payloadChecking', payload)
  const createResult = yield call(createEmailFlow, payload)

  if (createResult.success) {
    // Set to LocalStorage
    localStorage.setItem('currEmailFlow', JSON.stringify(createResult.currEmailFlow))

    // Set to props
    localStorage.setItem(
      'emailFlowHandlingStatus',
      JSON.stringify({
        handlingStatus: {
          create: false,
          edit: true,
        },
      }),
    )

    yield put({
      type: 'emailFlow/SET_STATE',
      payload: {
        currEmailFlow: createResult.currEmailFlow,
        handlingStatus: {
          create: false,
          edit: true,
        },
      },
    })

    const getEmailFlowsResult = yield call(getEmailFlows)
    const emailFlows = getEmailFlowsResult.emailFlows

    yield put({
      type: 'emailFlow/SET_STATE',
      payload: {
        pageLoading: false,
        emailFlows: emailFlows,
      },
    })

    message.success({
      content: 'Your email flow has created successfully',
      // content: getResult.message,
    })
  } else {
    // message.error({
    //   content: updateResult.error,
    // })
  }
}

export function* UPDATE_EMAIL_FLOW({ payload }) {
  yield put({
    type: 'emailFlow/SET_STATE',
    payload: {
      pageLoading: true,
    },
  })

  // message.info({
  //   content: 'Please wait a moment! We are getting selected email flow from database ...',
  // })

  // const { selectedEmailFlowId } = payload
  console.log('SAGAS UPDATE EMAIL FLOW payloadChecking', payload)
  const updateResult = yield call(updateEmailFlow, payload)

  if (updateResult.success) {
    // Set to LocalStorage
    localStorage.setItem('currEmailFlow', JSON.stringify(updateResult.currEmailFlow))

    // Set to props
    localStorage.setItem(
      'emailFlowHandlingStatus',
      JSON.stringify({
        handlingStatus: {
          create: false,
          edit: true,
        },
      }),
    )
    yield put({
      type: 'emailFlow/SET_STATE',
      payload: {
        currEmailFlow: updateResult.currEmailFlow,
        handlingStatus: {
          create: false,
          edit: true,
        },
      },
    })

    yield put({
      type: 'emailFlow/SET_STATE',
      payload: {
        pageLoading: false,
        isSaved: true,
      },
    })

    message.success({
      content: 'Your email flow has updated successfully',
      // content: getResult.message,
    })
  } else {
    message.error({
      content: updateResult.error,
    })
  }
  // } else {
  //   message.error({
  //     content: updateResult.error,
  //   })
  // }
}

export function* DELETE_EMAIL_FLOWS({ payload }) {
  yield put({
    type: 'emailFlow/SET_STATE',
    payload: {
      pageLoading: true,
    },
  })

  message.info({
    content: 'Please wait a moment ...',
  })

  // const { selectedEmailFlowId } = payload
  console.log('SAGAS DELETE EMAIL FLOWS payloadChecking', payload)
  const deleteResult = yield call(deleteEmailFlows, payload)

  if (deleteResult.success) {
    // Set to props
    // yield put({
    //   type: 'emailFlow/SET_STATE',
    //   payload: {},
    // })

    const getEmailFlowsResult = yield call(getEmailFlows)
    const emailFlows = getEmailFlowsResult.emailFlows

    yield put({
      type: 'emailFlow/SET_STATE',
      payload: {
        deleteResult: deleteResult,
        pageLoading: false,
        emailFlows: emailFlows,
      },
    })

    message.success({
      content: `All selected email flows deleted successfully`,
      // content: getResult.message,
    })
  } else {
    message.error({
      content: `Warning! Some email flows may not be deleted`,
    })
    yield put({
      type: 'emailFlow/SET_STATE',
      payload: {
        deleteResult: deleteResult,
        pageLoading: false,
      },
    })
  }
}

export function* START_EMAIL_FLOW({ payload }) {
  yield put({
    type: 'emailFlow/SET_STATE',
    payload: {
      pageLoading: true,
    },
  })
  let sendStatus = {
    automationFlowId: payload.id,
    statusId: '',
  }

  let currStatus = payload.status.name

  if (currStatus === EmailFlowOperationStatus.RUNNING.name) {
    sendStatus.statusId = EmailFlowOperationStatus.RUNNING.id
  }
  if (currStatus === EmailFlowOperationStatus.AVAILABLE.name) {
    sendStatus.statusId = EmailFlowOperationStatus.AVAILABLE.id
  }

  // const { selectedEmailFlowId } = payload
  console.log('SAGAS START EMAIL FLOW payloadChecking', payload)
  console.log('SAGAS START EMAIL FLOW sendStart', sendStatus)
  const startResult = yield call(startEmailFlow, sendStatus)
  console.log('SAGAS START_RESULT', startResult)

  if (startResult.success) {
    // Set to LocalStorage
    // localStorage.setItem('currEmailFlow', JSON.stringify(startResult.currEmailFlow))

    // Set to props
    localStorage.setItem(
      'emailFlowHandlingStatus',
      JSON.stringify({
        handlingStatus: {
          create: false,
          edit: true,
        },
      }),
    )

    yield put({
      type: 'emailFlow/SET_STATE',
      payload: {
        currEmailFlow: startResult.currEmailFlow,
        handlingStatus: {
          create: false,
          edit: true,
        },
      },
    })

    const getEmailFlowsResult = yield call(getEmailFlows)
    const emailFlows = getEmailFlowsResult.emailFlows

    yield put({
      type: 'emailFlow/SET_STATE',
      payload: {
        pageLoading: false,
        // emailFlows: emailFlows,
      },
    })

    // message.success({
    //   content: 'Your email flow has created successfully',
    //   // content: getResult.message,
    // })
  } else {
    // message.error({
    //   content: updateResult.error,
    // })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_EMAIL_FLOWS, GET_EMAIL_FLOWS),
    takeEvery(actions.GET_EMAIL_FLOW_BY_ID, GET_EMAIL_FLOW_BY_ID),
    takeEvery(actions.UPDATE_EMAIL_FLOW, UPDATE_EMAIL_FLOW),
    takeEvery(actions.DELETE_EMAIL_FLOWS, DELETE_EMAIL_FLOWS),
    takeEvery(actions.CREATE_EMAIL_FLOW, CREATE_EMAIL_FLOW),
    takeEvery(actions.START_EMAIL_FLOW, START_EMAIL_FLOW),
  ])
}
