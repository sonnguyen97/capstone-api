import actions from './actions'

const defaultActionDuration = 12
const defaultConditionDuration = 6

const initialState = {
  pageLoading: false,
  emailFlows: [],
  currEmailFlow: {
    id: null,
    lastModifiedDate: null,
    name: null,
    status: {
      name: 'Available',
    },
    stepSequence: {
      stepCommonData: {
        id: null,
        startDuration: defaultActionDuration,
        stepType: {
          name: 'Action',
          id: 'ffc65803-68fb-4b2c-94f9-97e239bd93a8',
        },
      },
      newsletter: {
        id: null,
        name: null,
      },
      nextStep: {
        stepCommonData: {
          id: null,
          startDuration: defaultConditionDuration,
          stepType: {
            name: 'Condition',
            id: 'f22c1d0b-e1d4-4836-a693-d5a88e4705d4',
          },
        },
        conditionType: {
          name: null,
          description: null,
        },
        matchedStep: {
          stepCommonData: {
            id: null,
            startDuration: defaultConditionDuration,
            stepType: {
              name: 'Action',
              id: 'ffc65803-68fb-4b2c-94f9-97e239bd93a8',
            },
          },
          newsletter: {
            id: null,
            name: null,
          },
          nextStep: null,
        },
        failedStep: {
          stepCommonData: {
            id: null,
            startDuration: defaultConditionDuration,
            stepType: {
              name: 'Action',
              id: 'ffc65803-68fb-4b2c-94f9-97e239bd93a8',
            },
          },
          newsletter: {
            id: null,
            name: null,
          },
          nextStep: null,
        },
      },
    },
  },
}

export default function emailFlowReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
