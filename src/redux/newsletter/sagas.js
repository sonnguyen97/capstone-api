/* eslint-disable */
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification, message } from 'antd'
import {
  getNewsletters,
  deleteNewsletters,
  createNewsletter,
  updateNewsletter,
  getNewsletterById,
  sendmail,
  getEmailById,
  getAllAudience,
  updateNewsletterAudience,
} from '../../services/newsletter'

import actions from './actions'
// import * as selectors from './selectors'

const StatusConstant = {
  AVAILABLE: {
    id: 'c0316ed0-5fb4-491c-a581-62a251b1be8d',
    name: 'Available',
  },
  DELETED: {
    id: 'a6ee5994-1e42-467e-8cf7-e9132f08e292',
    name: 'Deleted',
  },
  PAUSED: {
    id: 'bd1b5402-4de9-44b3-8804-38b8ff271a17',
    name: 'Paused',
  },
  RUNNING: {
    id: '4cece002-1ae6-4bad-9633-ab30dc55b4e5',
    name: 'Running',
  },
}

export function* GET_NEWSLETTERS() {
  // message.info({
  //   content: 'Please wait a moment! We are getting newsletters from database ...',
  // })

  const getNewslettersResult = yield call(getNewsletters)
  console.log('SAGAS getNewslettersResult', getNewslettersResult)

  if (!getNewslettersResult.success) {
    message.error({
      content: getNewslettersResult.error,
    })
    yield put({
      type: 'newsletter/SET_STATE',
      payload: {
        newsletterList: [],
      },
    })
  } else {
    const newsletters = getNewslettersResult.newsletterList
    // if (!newsletters[0]) {
    //   message.info({
    //     content: 'No newsletter in our server',
    //   })
    // }
    yield put({
      type: 'newsletter/SET_STATE',
      payload: {
        newsletterList: newsletters,
      },
    })
  }

  // localStorage.removeItem('newsletter_audienceList')
  // localStorage.removeItem('temp_emailBody')
  // localStorage.setItem(
  //   'newsletterHandlingStatus',
  //   JSON.stringify({ isCreate: false, isUpdate: false }),
  // )
}

export function* CREATE_NEWSLETTER({ payload }) {
  message.info({
    content: 'Please wait a moment! We are creating your newsletter ...',
  })

  console.log('SAGAS CREATE NEWSLETTER payloadChecking', payload)
  const postNewsletter = payload
  const createResult = yield call(createNewsletter, postNewsletter)

  if (createResult.success) {
    // Set to LocalStorage
    localStorage.setItem('currNewsletter', JSON.stringify(createResult.createdNewsletter))
    localStorage.setItem(
      'newsletterHandlingStatus',
      JSON.stringify({
        handlingStatus: {
          create: true,
          edit: false,
        },
      }),
    )

    // set to props
    yield put({
      type: 'newsletter/SET_STATE',
      payload: {
        currNewsletter: createResult.createdNewsletter,
        handlingStatus: {
          create: true,
          edit: false,
        },
      },
    })

    message.success({
      content: 'Created newsletter successfully',
      // content: createResult.message,
    })
  } else {
    message.error({
      content: createResult.error,
    })
  }
}

export function* GET_NEWSLETTER_BY_ID({ payload }) {
  yield put({
    type: 'newsletter/SET_STATE',
    payload: {
      pageLoading: true,
    },
  })

  // message.info({
  //   content: 'Please wait a moment! We are getting selected newsletter from database ...',
  // })

  const { selectedNewsletter } = payload
  console.log('SAGAS GET NEWSLETTER BY ID payloadChecking', selectedNewsletter)
  const getResult = yield call(getNewsletterById, selectedNewsletter)

  if (getResult.success) {
    // Set to LocalStorage
    localStorage.setItem('currNewsletter', JSON.stringify(getResult.currNewsletter))
    localStorage.setItem(
      'newsletterHandlingStatus',
      JSON.stringify({
        handlingStatus: {
          create: false,
          edit: true,
        },
      }),
    )

    // Set to props
    yield put({
      type: 'newsletter/SET_STATE',
      payload: {
        currNewsletter: getResult.currNewsletter,
        handlingStatus: {
          create: false,
          edit: true,
        },
      },
    })

    // message.success({
    //   content: 'Your newsletter has recovered successfully',
    //   // content: getResult.message,
    // })
  } else {
    message.error({
      content: getResult.error,
    })
  }
}

export function* DELETE_NEWSLETTERS({ payload }) {
  const selectedNewsletters = payload
  console.log('SAGAS DELETE NEWSLETTER selectedNewsletters', selectedNewsletters)

  message.info({
    content: 'Please wait a moment ...',
  })

  const deleteResponse = yield call(deleteNewsletters, selectedNewsletters)

  if (deleteResponse.finish) {
    yield put({
      type: 'newsletter/SET_STATE',
      payload: {
        deletedNewslettersResult: deleteResponse.result,
        pageLoading: false,
      },
    })
    message.success({
      content: 'All selected newsletters deleted successfully',
    })
  } else {
    yield put({
      type: 'newsletter/SET_STATE',
      payload: { deletedNewslettersResult: deleteResponse.error },
    })
    message.warning({
      content: 'Warning! Some newsletters may not be deleted yet',
    })
  }
}

export function* UPDATE_NEWSLETTER({ payload }) {
  message.info({
    content: 'Saving newsletter ...',
  })

  yield put({
    type: 'newsletter/SET_STATE',
    payload: {
      pageLoading: true,
    },
  })

  const currNewsletter = payload
  console.log('SAGAS UPDATE NEWSLETTER currNewsletter', currNewsletter)

  const updateStatus = yield call(updateNewsletter, currNewsletter)

  if (updateStatus.success) {
    console.log('SAGAS UPDATE NEWSLETTER updateStatus.currNewsletter', updateStatus)
    localStorage.setItem('currNewsletter', JSON.stringify(updateStatus.currNewsletter))
    message.success({
      content: `Email content saved succesfully`,
    })
    // window.location.reload()
  } else {
    message.error({
      content: getResult.error,
    })
  }

  yield put({
    type: 'newsletter/SET_STATE',
    payload: {
      pageLoading: false,
    },
  })
}

export function* GET_ALL_AUDIENCE() {
  const getAudienceListResult = yield call(getAllAudience)

  if (getAudienceListResult.success) {
    const audienceList = getAudienceListResult.audienceList

    localStorage.setItem('newsletter_audienceList', JSON.stringify(audienceList))
    // console.log('SAGAS GET ALL AUDIENCE audienceList', audienceList)
    yield put({
      type: 'newsletter/SET_STATE',
      payload: {
        audienceList,
      },
    })
  } else {
    message.error({
      content: 'Error! Cannot get audience list due to server error',
    })
  }
}

export function* SEND_MAIL({ payload }) {
  message.info({
    content: 'Newsletter is sending ...',
  })

  const currNewsletter = payload
  console.log('SAGAS SEND MAIL payload', currNewsletter)

  const getResult = yield call(sendmail, payload)
  if (getResult.success) {
    message.success({
      content: 'Newsletter sent successfully to subscribers!',
    })
    console.log('Send Newsletter Result', getResult)
  } else {
    message.error({
      content: 'There are some errors',
    })
  }
}

// eslint-disable-next-line
// export function* UPDATE_NEWSLETTER_AUDIENCE({ payload }) {
//   console.log('Sagas_UpdateNewsletterAudience', payload)
//   const updateAudienceResult = yield call(updateNewsletterAudience, payload)
//   console.log('updateAudienceResult', updateAudienceResult)
//   if (updateAudienceResult.success) {
//     message.success({
//       content: 'Email Content updated successfully!',
//     })
//   } else {
//     message.error({
//       content: 'Updated "Receivers" failed!',
//     })
//   }
// }

export default function* rootSaga() {
  yield all([
    takeEvery(actions.GET_NEWSLETTERS, GET_NEWSLETTERS),
    takeEvery(actions.DELETE_NEWSLETTERS, DELETE_NEWSLETTERS),
    takeEvery(actions.CREATE_NEWSLETTER, CREATE_NEWSLETTER),
    takeEvery(actions.UPDATE_NEWSLETTER, UPDATE_NEWSLETTER),
    takeEvery(actions.GET_NEWSLETTER_BY_ID, GET_NEWSLETTER_BY_ID),
    takeEvery(actions.SEND_MAIL, SEND_MAIL),
    takeEvery(actions.GET_ALL_AUDIENCE, GET_ALL_AUDIENCE),
    // takeEvery(actions.UPDATE_NEWSLETTER_AUDIENCE, UPDATE_NEWSLETTER_AUDIENCE),
  ])
}
