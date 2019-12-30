import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import user from './user/reducers'
import menu from './menu/reducers'
import settings from './settings/reducers'
import subscriber from './subscriber/reducers'
import newsletter from './newsletter/reducers'
import criterionType from './criterion/reducers'
import audience from './audience/reducers'
import adminAccount from './adminAccount/reducers'
import emailTemplate from './emailTemplate/reducers'
import campaign from './campaign/reducers'
import statistics from './statistics/reducers'
import emailflow from './emailflow/reducers'

export default history =>
  combineReducers({
    router: connectRouter(history),
    user,
    menu,
    settings,
    subscriber,
    newsletter,
    criterionType,
    audience,
    adminAccount,
    emailTemplate,
    campaign,
    statistics,
    emailflow,
    // tag
  })
