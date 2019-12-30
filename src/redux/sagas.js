import { all } from 'redux-saga/effects'
import user from './user/sagas'
import menu from './menu/sagas'
import settings from './settings/sagas'
import newsletter from './newsletter/sagas'
import criterionType from './criterion/sagas'
import audience from './audience/sagas'
import subscriber from './subscriber/sagas'
import adminAccount from './adminAccount/sagas'
import emailTemplate from './emailTemplate/sagas'
import campaign from './campaign/sagas'
import statistics from './statistics/sagas'
import emailflow from './emailflow/sagas'

export default function* rootSaga() {
  yield all([
    adminAccount(),
    user(),
    menu(),
    settings(),
    newsletter(),
    criterionType(),
    audience(),
    subscriber(),
    emailTemplate(),
    campaign(),
    statistics(),
    emailflow(),
  ])
}
