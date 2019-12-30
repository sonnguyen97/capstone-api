import { all, put, call, takeEvery } from 'redux-saga/effects'
import actions from './actions'
import { getDefinitionAudience, getCriterionType } from '../../services/criteria'

export function* GET_CRITERION_TYPE() {
  const criterionTypes = yield call(getCriterionType)
  console.log(criterionTypes)
  yield put({
    type: 'criterion/SET_STATE',
    payload: {
      criterionTypes,
    },
  })
}

export function* GET_AUDIENCE_DEFINITION() {
  const definition = yield call(getDefinitionAudience)
  yield put({
    type: 'criterion/SET_STATE',
    payload: {
      definition,
    },
  })
}

export default function* rootSaga() {
  yield all([takeEvery(actions.GET_CRITERION_TYPE, GET_CRITERION_TYPE)])
  yield all([takeEvery(actions.GET_AUDIENCE_DEFINITION, GET_AUDIENCE_DEFINITION)])
}
