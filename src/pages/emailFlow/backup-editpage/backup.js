const emailFlow = {
  id: null,
  lastModifiedDate: new Date(),
  name: values.emailFlowName,
  status: {
    name: 'Available',
  },
  stepSequence: {
    stepCommonData: {
      id: null,
      start_duration: defaultActionDuration,
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
        start_duration: defaultConditionDuration,
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
          start_duration: defaultConditionDuration,
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
          start_duration: defaultConditionDuration,
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
}
