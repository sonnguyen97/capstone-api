import actions from './actions'

const initialState = {
  // visitor:[],
  // mostProduct:[]
}

export default function adminAccountReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
