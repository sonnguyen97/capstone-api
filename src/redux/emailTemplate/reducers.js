import actions from './actions'

const initialState = {
  emailTemplate: {
    id: null,
    name: null,
    body: '',
    raw_content: '',
  },
}

export default function emailTemplateReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
