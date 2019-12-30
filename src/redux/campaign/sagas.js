/* eslint-disable */
import { all, takeEvery, put, call } from 'redux-saga/effects'
import { notification } from 'antd'
import {
  changeOperationStatusCampaign,
  createCampaignAfterSaveName,
  getCampaignById,
  updateCampaign,
  createCampaign,
  deleteCampaigns,
  getAllCampaigns,
  changeOperationStatusAutomatedCampaign,
  getAutomatedCampaign,
  createAutomatedCampaign,
} from '../../services/campaign'

import actions from './actions'

export function* EDIT_CAMPAIGN_NAME({ payload }) {
  const { campaignName } = payload
  notification.success({
    message: 'Edited campaign name success!',
  })
  localStorage.removeItem('campaignName')
  localStorage.setItem('campaignName', campaignName)
}

export function* CREATE_AUTOMATED_CAMPAIGNS({ payload }) {
  const createAutomationStatus = yield call(createAutomatedCampaign, JSON.stringify(payload))
  if (createAutomationStatus) {
    notification.success({
      message: 'Saved automated campaign successfully',
    })
  }
}

export function* GET_AUTOMATED_CAMPAIGN({ payload }) {
  const automatedData = yield call(getAutomatedCampaign, JSON.stringify(payload))
  yield put({
    type: 'campaign/SET_STATE',
    payload: automatedData,
  })
}

export function* START_STOP_AUTOMATION({ payload }) {
  const isStartStop = yield call(changeOperationStatusAutomatedCampaign, JSON.stringify(payload))
  if (isStartStop) {
    notification.success({
      message: `${payload.name} automated campaign successfully`,
    })
    const automatedData = yield call(getAutomatedCampaign)
    yield put({
      type: 'campaign/SET_STATE',
      payload: automatedData,
    })
  } else {
    notification.error({
      message: `${payload.name} automated campaign failed`,
    })
  }
}

export function* GET_ALL_CAMPAIGNS() {
  const campaigns = yield call(getAllCampaigns)
  yield put({
    type: 'campaign/SET_STATE',
    payload: campaigns,
  })
}

export function* DELETE_CAMPAIGNS({ payload }) {
  const campaigns = yield call(deleteCampaigns, JSON.stringify(payload))
  if (campaigns) {
    notification.success({
      message: 'Deleted Campaign Successfully!',
    })
    const campaigns = yield call(getAllCampaigns)
    yield put({
      type: 'campaign/SET_STATE',
      payload: campaigns,
    })
  }
}

export function* SAVE_CAMPAIGN_NAME({ payload }) {
  const { campaignName } = payload
  console.log(payload)
  const campaignObj = yield call(createCampaign, JSON.stringify(payload))
  if (campaignObj) {
    notification.success({
      message: `Created campaign ${campaignName} successfully!`,
    })
    localStorage.setItem('campaignObj', JSON.stringify(campaignObj))
    localStorage.setItem('campaignId', JSON.stringify(campaignObj.id))
    yield put({
      type: 'campaign/SET_STATE',
      payload: { campaignObj, campaignName: campaignObj.name, status: campaignObj.status },
    })
  }
  // localStorage.setItem('campaignName', campaignName)
}

export function* UPDATE_CAMPAIGN({ payload }) {
  const { campaignName, SelectedNewsletter, SelectedAudience } = payload
  const isNewsletterArray = !SelectedNewsletter.length ? 0 : 1
  const isAudienceArray = !SelectedAudience.length ? 0 : 1
  // const newsletter = isNewsletterArray > 0
  // const audience = isAudienceArray > 0
  if (isNewsletterArray === 1) {
    payload.SelectedNewsletter = null
  }
  if (isAudienceArray === 1) {
    payload.SelectedAudience = null
  }
  console.log(payload)
  const campaignObj = yield call(updateCampaign, JSON.stringify(payload))
  if (campaignObj) {
    notification.success({
      message: `Saved campaign ${campaignName} successfully!`,
    })
    localStorage.setItem('campaignObj', JSON.stringify(campaignObj))
    yield put({
      type: 'campaign/SET_STATE',
      payload: { campaignObj, campaignName: campaignObj.name },
    })
  }
}

export function* GET_CAMPAIGN_BY_ID({ payload }) {
  console.log(payload)
  const id = payload.id
  console.log('-------------------------------')
  const campaignObj = yield call(getCampaignById, id)
  if (campaignObj) {
    const res = campaignObj.res
    const campaign = res.Campaign
    const campaignName = campaign.name
    const campaignId = campaign.id
    const status = campaign.status

    // this.props.history.push('./update')
    localStorage.setItem('campaignObjUpdate', JSON.stringify(campaignObj))
    localStorage.removeItem('campaignName')
    localStorage.setItem('campaignName', campaignName)
    localStorage.setItem('campaignId', campaignId)
    yield put({
      type: 'campaign/SET_STATE',
      payload: { campaignObj, status },
    })
  } else {
    const campaignObj = {
      mins: 0,
      hours: 0,
      dayOfWeek: [],
      sendType: 'Daily',
    }
    localStorage.setItem('campaignObjUpdate', JSON.stringify(campaignObj))
    yield put({
      type: 'campaign/SET_STATE',
      payload: { campaignObj },
    })
  }
}

export function* CREATE_CAMPAIGN_AFTER_SAVE_NAME({ payload }) {
  const { campaignName, SelectedNewsletter, SelectedAudience } = payload
  const isNewsletterArray = !SelectedNewsletter.length ? 0 : 1
  const isAudienceArray = !SelectedAudience.length ? 0 : 1
  // const newsletter = isNewsletterArray > 0
  // const audience = isAudienceArray > 0
  if (isNewsletterArray === 1) {
    payload.SelectedNewsletter = null
  }
  if (isAudienceArray === 1) {
    payload.SelectedAudience = null
  }
  console.log(payload)
  const campaignObj = yield call(createCampaignAfterSaveName, JSON.stringify(payload))

  if (campaignObj) {
    notification.success({
      message: `Saved campaign ${campaignName} successfully!`,
    })
    localStorage.setItem('campaignObj', JSON.stringify(campaignObj))
    yield put({
      type: 'campaign/SET_STATE',
      payload: { campaignObj, campaignName: campaignObj.name },
    })
  }
}

export function* START_STOP_CAMPAIGN({ payload }) {
  const status = yield call(changeOperationStatusCampaign, JSON.stringify(payload))
  if (status) {
    notification.success({
      message: `${payload.name} campaign successfully`,
    })
    yield put({
      type: 'campaign/SET_STATE',
      payload: { status },
    })
  } else {
    notification.error({
      message: `${payload.name} campaign failed`,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.EDIT_CAMPAIGN_NAME, EDIT_CAMPAIGN_NAME),
    takeEvery(actions.CREATE_AUTOMATED_CAMPAIGNS, CREATE_AUTOMATED_CAMPAIGNS),
    takeEvery(actions.GET_AUTOMATED_CAMPAIGN, GET_AUTOMATED_CAMPAIGN),
    takeEvery(actions.START_STOP_CAMPAIGN, START_STOP_CAMPAIGN),
    takeEvery(actions.GET_ALL_CAMPAIGNS, GET_ALL_CAMPAIGNS),
    takeEvery(actions.DELETE_CAMPAIGNS, DELETE_CAMPAIGNS),
    takeEvery(actions.SAVE_CAMPAIGN_NAME, SAVE_CAMPAIGN_NAME),
    takeEvery(actions.UPDATE_CAMPAIGN, UPDATE_CAMPAIGN),
    takeEvery(actions.GET_CAMPAIGN_BY_ID, GET_CAMPAIGN_BY_ID),
    takeEvery(actions.CREATE_CAMPAIGN_AFTER_SAVE_NAME, CREATE_CAMPAIGN_AFTER_SAVE_NAME),
    takeEvery(actions.START_STOP_AUTOMATION, START_STOP_AUTOMATION),
    // takeEvery(actions.CREATE_NEW_CAMPAIGN, CREATE_NEW_CAMPAIGN),
  ])
}
