import actions from './actions'

const initialState = {
  id: '',
  email: '',
  last_modified_date: '',
  store_name: '',
  store_domain: '',
  role_id: '',
  status_id: '',
  authorized: false,
  loading: false,
  role: '',
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
