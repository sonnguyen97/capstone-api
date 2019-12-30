import actions from './actions'

const initialState = {
  pageLoading: false,
  newsletterList: null,
  audienceList: null,
  selectedNewsletters: [],
  currNewsletter: {
    id: null,
    last_modified_date: null,
    name: null,
    status: null,
    selectedAudiences: [],
    email: {
      id: null,
      from: '',
      subject: '',
      htmlContent: '',
      rawContent: '',
      templateId: null,
    },
    handlingStatus: {
      create: false,
      edit: false,
    },
  },
}

export default function newsletterReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
