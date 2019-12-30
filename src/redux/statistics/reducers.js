import actions from './actions'

const initialState = {
  pageLoading: false,
  statistics: {
    isOpened: 0,
    isNotOpened: 0,
    isNotClicked: 0,
    isClicked: 0,
    isBounced: 0,
    isSent: 0,
  },
}

export default function statisticsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
