import actions from './actions'

const initialState = {
  audienceId: '',
}

export default function audienceReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
