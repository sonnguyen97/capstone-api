/* eslint-disable */
import React, { Fragment, createRef } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import {
  PageHeader,
  Row,
  Col,
  Button,
  Tabs,
  Table,
  Tag,
  Divider,
  Input,
  Form,
  Modal,
  notification,
  Descriptions,
  Steps,
  Icon,
  Select,
  Spin,
  Empty,
  InputNumber,
} from 'antd'
import Moment from 'react-moment'

const { Step } = Steps
const FormItem = Form.Item
const { Option } = Select
const { Search } = Input
const { confirm } = Modal

const Status = {
  paused: 'Paused',
  available: 'Available',
  running: 'Running',
}

/* --------------------------------------------------------------- */
// EDIT EMAILFLOW NAME FORM
const EmailflowEditNameForm = Form.create({ name: 'edit_emailFlow_name_in_modal' })(
  class extends React.Component {
    render() {
      const { visible, onCancel, onSave, form } = this.props
      const { getFieldDecorator } = form

      let currEmailFlow = !localStorage.getItem('currEmailFlow')
        ? null
        : JSON.parse(localStorage.getItem('currEmailFlow'))

      let emailFlowName = !currEmailFlow.name ? '' : currEmailFlow.name

      return (
        <Modal
          visible={visible}
          title="Edit Email Flow Name"
          okText="Save"
          onCancel={onCancel}
          onOk={onSave}
        >
          <Form layout="vertical">
            <FormItem label="Email flow name">
              {getFieldDecorator('emailFlowName', {
                rules: [{ required: true, message: 'Please input email flow name' }],
                initialValue: emailFlowName,
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      )
    }
  },
)

// EDIT EMAILFLOW NAME FORM -- END
/* --------------------------------------------------------------- */

// WAIT TIME FORM
const WaitTimeForm = Form.create({ name: 'wait_time_form' })(
  class extends React.Component {
    render() {
      const { form, initialValue, onChange } = this.props
      const { getFieldDecorator } = form

      return (
        <Form layout="inline">
          <FormItem label="Wait for" colon={false}>
            {getFieldDecorator('waitTime', {
              rules: [{ required: true, message: 'Please input wait time' }],
              initialValue: initialValue,
            })(
              <InputNumber
                min={0}
                max={24}
                step={2}
                onChange={onChange}
                style={{ marginRight: 10 }}
              />,
            )}
            <span>hour(s)</span>
          </FormItem>
        </Form>
      )
    }
  },
)
// WAIT TIME FORM -- END
/* --------------------------------------------------------------- */

// ACTION STEP FORM
const ActionStepForm = Form.create({ name: 'action_step_form' })(
  class extends React.Component {
    render() {
      const {
        form,
        initialValue,
        selectedOnChange,
        newsletterList,
        loading,
        layoutType,
      } = this.props
      const { getFieldDecorator } = form
      const newsletterChildren = []

      if (newsletterList) {
        newsletterList.forEach(item => {
          newsletterChildren.push(<Option value={item.id}>{item.name}</Option>)
        })
      }

      return (
        <Form layout={layoutType}>
          <FormItem label="Send newsletter" colon={false}>
            {getFieldDecorator('selectedNewsletter', {
              rules: [{ required: true, message: 'Please choose a newsletter' }],
              initialValue: initialValue,
            })(
              <Select
                style={{ width: 300 }}
                mode="default"
                placeholder={'choose a newsletter'}
                onChange={selectedOnChange}
                labelInValue={true}
                size="large"
                loading={loading}
              >
                {newsletterChildren}
              </Select>,
            )}
          </FormItem>
        </Form>
      )
    }
  },
)
// ACTION STEP FORM -- END
/* --------------------------------------------------------------- */

// CONDITION STEP FORM
const ConditionStepForm = Form.create({ name: 'condition_step_form' })(
  class extends React.Component {
    render() {
      const { form, initialValue, selectedOnChange, loading } = this.props
      const { getFieldDecorator } = form

      return (
        <Form layout="inline">
          <FormItem label="If a recipient has" colon={false}>
            {getFieldDecorator('conditionType', {
              rules: [{ required: true, message: 'Please select a condition' }],
              initialValue: initialValue,
            })(
              <Select
                style={{ width: 110, marginRight: 10 }}
                mode="default"
                placeholder="-------"
                onChange={selectedOnChange}
                labelInValue={true}
                size="large"
                loading={loading}
              >
                <Option value="Opened">Opened</Option>
                <Option value="Clicked">Clicked</Option>
              </Select>,
            )}
          </FormItem>
        </Form>
      )
    }
  },
)
// CONDITION STEP FORM -- END
/* --------------------------------------------------------------- */

// MAIN CODE
@connect(({ emailFlow }) => ({ emailFlow }))
@connect(({ newsletter }) => ({ newsletter }))
class EmailflowHome extends React.Component {
  state = {
    visible: false,
    history: this.props.history,
    dispatch: this.props.dispatch,
    nodeCount: 0,
    childrenNodes: [],
    editEmailflowNameVisibility: false,
    isSaved: false,
    // pageLoading: this.props.emailFlow.pageLoading,
  }

  componentDidMount = () => {
    console.log('EMAILFLOW_EDIT_PAGE componentDidMount PROPS', this.props)
    this.state.dispatch({
      type: 'newsletter/GET_NEWSLETTERS',
    })
  }

  componentWillReceiveProps(nextProps) {
    console.log('EMAILFLOW_HOME_PAGE componentWillReceiveProps PROPS', nextProps)
    // this.setState({ nextProps })
  }

  /* --------------------------------------------------------------- */

  // PAGE HEADER HANDLING FUNCTIONS
  handlingFinishLater = async () => {
    const { isSaved } = this.state
    const props = this
    let currEmailFlow = !localStorage.getItem('currEmailFlow')
      ? null
      : JSON.parse(localStorage.getItem('currEmailFlow'))

    if (currEmailFlow.status.name === Status.available) {
      if (!isSaved) {
        confirm({
          title: `Go back?`,
          content: `You have not saved current email flow. Do you want to save?`,
          cancelText: 'No',
          okText: 'Yes',
          async onOk() {
            console.log(`Save email flow`)
            await props.saveEmailFlow()
            if (props.state.isSaved === true) {
              setTimeout(() => {
                window.history.back()
              }, 1000)
            }
          },
          async onCancel() {
            console.log(`Cancel`)
            props.setState({ isSaved: false })
            setTimeout(() => {
              window.history.back()
            }, 1000)
          },
        })
      } else {
        setTimeout(() => {
          window.history.back()
        }, 1000)
      }
    } else {
      setTimeout(() => {
        window.history.back()
      }, 1000)
    }
  }

  validateEmailFlow = async () => {
    const startStepWaitTimeForm = this.startStepWaitTimeFormRef.props.form
    const startStepNewsletterForm = this.startStepNewsletterFormRef.props.form

    const conditionStepWaitTimeForm = this.conditionStepWaitTimeFormRef.props.form
    const conditionStepForm = this.conditionStepFormRef.props.form

    const matchedStepWaitTimeForm = this.matchedStepWaitTimeFormRef.props.form
    const matchedStepNewsletterForm = this.matchedStepNewsletterFormRef.props.form

    const failedStepWaitTimeForm = this.failedStepWaitTimeFormRef.props.form
    const failedStepNewsletterForm = this.failedStepNewsletterFormRef.props.form

    /// VALIDATION START STEP
    /// wait time
    let isStartStepWaitTimeSuccess = await startStepWaitTimeForm
      .validateFields((err, values) => {})
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
    // console.log('isStartStepWaitTimeSuccess', isStartStepWaitTimeSuccess)

    /// newsletter
    let isStartStepNewsletterSuccess = await startStepNewsletterForm
      .validateFields((err, values) => {})
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
    // console.log('isStartStepNewsletterSuccess', isStartStepNewsletterSuccess)

    /// VALIDATION CONDITION STEP
    /// wait time
    let isConditionStepWaitTimeSuccess = await conditionStepWaitTimeForm
      .validateFields((err, values) => {})
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
    // console.log('isConditionStepWaitTimeSuccess', isConditionStepWaitTimeSuccess)

    /// condition type
    let isConditionStepTypeSuccess = await conditionStepForm
      .validateFields((err, values) => {})
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
    // console.log('isConditionStepTypeSuccess', isConditionStepTypeSuccess)

    /// VALIDATION MATCHED STEP
    /// wait time
    let isMatchedStepWaitTimeSuccess = await matchedStepWaitTimeForm
      .validateFields((err, values) => {})
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
    // console.log('isMatchedStepWaitTimeSuccess', isMatchedStepWaitTimeSuccess)

    /// newsletter
    let isMatchedStepNewsletterSuccess = await matchedStepNewsletterForm
      .validateFields((err, values) => {})
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
    // console.log('isMatchedStepNewsletterSuccess', isMatchedStepNewsletterSuccess)

    /// VALIDATION MATCHED STEP
    /// wait time
    let isFailedStepWaitTimeSuccess = await failedStepWaitTimeForm
      .validateFields((err, values) => {})
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
    // console.log('isFailedStepWaitTimeSuccess', isFailedStepWaitTimeSuccess)

    /// newsletter
    let isFailedStepNewsletterSuccess = await failedStepNewsletterForm
      .validateFields((err, values) => {})
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })
    // console.log('isFailedStepNewsletterSuccess', isFailedStepNewsletterSuccess)

    if (
      isStartStepWaitTimeSuccess &&
      isStartStepNewsletterSuccess &&
      isConditionStepWaitTimeSuccess &&
      isConditionStepTypeSuccess &&
      isMatchedStepWaitTimeSuccess &&
      isMatchedStepNewsletterSuccess &&
      isFailedStepWaitTimeSuccess &&
      isFailedStepNewsletterSuccess
    ) {
      return true
    } else {
      return false
    }
  }

  startEmailFlow = async () => {
    // await this.saveEmailFlow()
    // let isValidatedSuccess = await this.validateEmailFlow()
    // console.log('isValidatedSuccess', isValidatedSuccess)
    let currEmailFlow = !localStorage.getItem('currEmailFlow')
      ? null
      : JSON.parse(localStorage.getItem('currEmailFlow'))

    currEmailFlow.status.name = Status.running

    localStorage.setItem('currEmailFlow', JSON.stringify(currEmailFlow))

    const isSaved = this.props.emailFlow.isSaved
    if (isSaved) {
      this.state.dispatch({
        type: 'emailFlow/START_EMAIL_FLOW',
        payload: currEmailFlow,
      })
      // window.history.back()
    } else {
      notification.warning({
        message: 'Please save before start email flow',
      })
    }
  }

  pauseEmailFlow = () => {
    let currEmailFlow = !localStorage.getItem('currEmailFlow')
      ? null
      : JSON.parse(localStorage.getItem('currEmailFlow'))

    currEmailFlow.status.name = Status.available

    localStorage.setItem('currEmailFlow', JSON.stringify(currEmailFlow))
    this.state.dispatch({
      type: 'emailFlow/START_EMAIL_FLOW',
      payload: currEmailFlow,
    })
    // window.location.reload()
  }

  saveEmailFlow = async () => {
    let currHandlingStatus = JSON.parse(localStorage.getItem('emailFlowHandlingStatus'))
    // console.log(currHandlingStatus)
    let isCreating = currHandlingStatus.handlingStatus.create

    let currEmailFlow = !localStorage.getItem('currEmailFlow')
      ? null
      : JSON.parse(localStorage.getItem('currEmailFlow'))
    let currEmailFlowId = currEmailFlow.id

    let isValidatedSuccess = await this.validateEmailFlow()
    console.log('isValidatedSuccess', isValidatedSuccess)

    if (isValidatedSuccess) {
      if (isCreating) {
        // call create email flow
        this.state.dispatch({
          type: 'emailFlow/CREATE_EMAIL_FLOW',
          payload: currEmailFlow,
        })
        console.log('Creating email flow')

        window.history.back()
      } else {
        // call edit email flow
        console.log('Editing email flow')
        this.state.dispatch({
          type: 'emailFlow/UPDATE_EMAIL_FLOW',
          payload: currEmailFlow,
        })
      }

      this.setState({ isSaved: true })
    }
  }

  // PAGE HEADER HANDLING FUNCTIONS -- END

  /* --------------------------------------------------------------- */

  // PAGE BODY HANDLING FUNCTIONS

  // Start step wait time form handling
  startStepWaitTimeOnChange = value => {
    console.log('Start Step wait time value', value)
    let currEmailFlow = !localStorage.getItem('currEmailFlow')
      ? null
      : JSON.parse(localStorage.getItem('currEmailFlow'))

    currEmailFlow.stepSequence.stepCommonData.startDuration = value

    // console.log('currEmailFlow', currEmailFlow)
    localStorage.setItem('currEmailFlow', JSON.stringify(currEmailFlow))
  }
  startStepNewsletterSelectOnChange = value => {
    console.log('Start Step newsletter value', value)
    let currEmailFlow = !localStorage.getItem('currEmailFlow')
      ? null
      : JSON.parse(localStorage.getItem('currEmailFlow'))

    currEmailFlow.stepSequence.newsletter.id = value.key
    currEmailFlow.stepSequence.newsletter.name = value.label

    // console.log('currEmailFlow', currEmailFlow)
    localStorage.setItem('currEmailFlow', JSON.stringify(currEmailFlow))
  }

  // Condition step action form handling
  conditionStepWaitTimeOnChange = value => {
    console.log('Condition Type Step wait time value', value)
    let currEmailFlow = !localStorage.getItem('currEmailFlow')
      ? null
      : JSON.parse(localStorage.getItem('currEmailFlow'))

    currEmailFlow.stepSequence.nextStep.stepCommonData.startDuration = value

    // console.log('currEmailFlow', currEmailFlow)
    localStorage.setItem('currEmailFlow', JSON.stringify(currEmailFlow))
  }
  conditionStepTypeSelectOnChange = value => {
    console.log('Condition Type Step newsletter value', value)
    let currEmailFlow = !localStorage.getItem('currEmailFlow')
      ? null
      : JSON.parse(localStorage.getItem('currEmailFlow'))

    currEmailFlow.stepSequence.nextStep.conditionType.name = value.key

    // console.log('currEmailFlow', currEmailFlow)
    localStorage.setItem('currEmailFlow', JSON.stringify(currEmailFlow))
  }

  // Matched step action form handling
  matchedStepWaitTimeOnChange = value => {
    console.log('Matched Step wait time value', value)
    let currEmailFlow = !localStorage.getItem('currEmailFlow')
      ? null
      : JSON.parse(localStorage.getItem('currEmailFlow'))

    currEmailFlow.stepSequence.nextStep.matchedStep.stepCommonData.startDuration = value

    // console.log('currEmailFlow', currEmailFlow)
    localStorage.setItem('currEmailFlow', JSON.stringify(currEmailFlow))
  }
  matchedStepNewsletterSelectOnChange = value => {
    console.log('Matched Step newsletter value', value)
    let currEmailFlow = !localStorage.getItem('currEmailFlow')
      ? null
      : JSON.parse(localStorage.getItem('currEmailFlow'))

    currEmailFlow.stepSequence.nextStep.matchedStep.newsletter.id = value.key
    currEmailFlow.stepSequence.nextStep.matchedStep.newsletter.name = value.label

    // console.log('currEmailFlow', currEmailFlow)
    localStorage.setItem('currEmailFlow', JSON.stringify(currEmailFlow))
  }

  // Failed step action form handling
  failedStepWaitTimeOnChange = value => {
    console.log('Failed Step wait time value', value)
    let currEmailFlow = !localStorage.getItem('currEmailFlow')
      ? null
      : JSON.parse(localStorage.getItem('currEmailFlow'))

    currEmailFlow.stepSequence.nextStep.failedStep.stepCommonData.startDuration = value

    // console.log('currEmailFlow', currEmailFlow)
    localStorage.setItem('currEmailFlow', JSON.stringify(currEmailFlow))
  }
  failedStepNewsletterSelectOnChange = value => {
    console.log('Failed Step newsletter value', value)
    let currEmailFlow = !localStorage.getItem('currEmailFlow')
      ? null
      : JSON.parse(localStorage.getItem('currEmailFlow'))

    currEmailFlow.stepSequence.nextStep.failedStep.newsletter.id = value.key
    currEmailFlow.stepSequence.nextStep.failedStep.newsletter.name = value.label

    // console.log('currEmailFlow', currEmailFlow)
    localStorage.setItem('currEmailFlow', JSON.stringify(currEmailFlow))
  }

  // Edit Email flow form handling
  saveEditNameFormRef = formRef => {
    this.editNameFormRef = formRef
  }

  openEditNameForm = () => {
    // const { dispatch } = this.props

    console.log('OPEN EDIT EMAIL FLOW NAME FORM - formProps', this.editNameFormRef)
    this.setState({ editEmailflowNameVisibility: true })
  }

  editFormOnCancel = e => {
    e.preventDefault()
    this.setState({ editEmailflowNameVisibility: false })
  }

  editFormOnSave = () => {
    const { form } = this.editNameFormRef.props
    // const { dispatch } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        console.log('email flow name: ', values)

        let currEmailFlow = !localStorage.getItem('currEmailFlow')
          ? null
          : JSON.parse(localStorage.getItem('currEmailFlow'))

        currEmailFlow.name = values.emailFlowName

        // const { dispatch } = this.props
        // dispatch({
        //   type: 'campaign/EDIT_CAMPAIGN_NAME',
        //   payload: values,
        // })

        localStorage.setItem('currEmailFlow', JSON.stringify(currEmailFlow))

        // form.resetFields()
        this.setState({ editEmailflowNameVisibility: false })
      }
    })
  }

  // PAGE BODY HANDLING FUNCTIONS -- END

  /* --------------------------------------------------------------- */

  // MAIN RENDERING
  render() {
    console.log('EMAIL FLOW EDIT PAGE render', this.props)
    const { pageLoading } = this.props.emailFlow
    let currHandlingStatus = JSON.parse(localStorage.getItem('emailFlowHandlingStatus'))
    // console.log(currHandlingStatus)
    let isCreating = currHandlingStatus.handlingStatus.create
    // console.log('pageLoading', pageLoading)

    if (!pageLoading) {
      const newsletterList =
        this.props.newsletter.newsletterList === [] ? [] : this.props.newsletter.newsletterList

      let currEmailFlow = !localStorage.getItem('currEmailFlow')
        ? null
        : JSON.parse(localStorage.getItem('currEmailFlow'))

      let emailFlowName = !currEmailFlow.name ? null : currEmailFlow.name
      let emailFlowStatus = !currEmailFlow.status.name ? null : currEmailFlow.status.name
      let lastModifiedDate = !currEmailFlow.lastModifiedDate ? null : currEmailFlow.lastModifiedDate

      let startStepWaitTime = !currEmailFlow.stepSequence.stepCommonData.startDuration
        ? undefined
        : currEmailFlow.stepSequence.stepCommonData.startDuration
      let startStepNewsletter = !currEmailFlow.stepSequence.newsletter.id
        ? undefined
        : {
            key: currEmailFlow.stepSequence.newsletter.id,
            label: currEmailFlow.stepSequence.newsletter.name,
          }

      let conditionStepWaitTime = !currEmailFlow.stepSequence.nextStep.stepCommonData.startDuration
        ? undefined
        : currEmailFlow.stepSequence.nextStep.stepCommonData.startDuration
      let conditionStepType = !currEmailFlow.stepSequence.nextStep.conditionType.name
        ? undefined
        : {
            key: currEmailFlow.stepSequence.nextStep.conditionType.name,
            label: currEmailFlow.stepSequence.nextStep.conditionType.name,
          }

      let matchedStepWaitTime = !currEmailFlow.stepSequence.nextStep.matchedStep.stepCommonData
        .startDuration
        ? undefined
        : currEmailFlow.stepSequence.nextStep.matchedStep.stepCommonData.startDuration
      let matchedStepNewsletter = !currEmailFlow.stepSequence.nextStep.matchedStep.newsletter.id
        ? undefined
        : {
            key: currEmailFlow.stepSequence.nextStep.matchedStep.newsletter.id,
            label: currEmailFlow.stepSequence.nextStep.matchedStep.newsletter.name,
          }

      let failedStepWaitTime = !currEmailFlow.stepSequence.nextStep.matchedStep.stepCommonData
        .startDuration
        ? undefined
        : currEmailFlow.stepSequence.nextStep.failedStep.stepCommonData.startDuration
      let failedStepNewsletter = !currEmailFlow.stepSequence.nextStep.failedStep.newsletter.id
        ? undefined
        : {
            key: currEmailFlow.stepSequence.nextStep.failedStep.newsletter.id,
            label: currEmailFlow.stepSequence.nextStep.failedStep.newsletter.name,
          }

      return (
        <section className="card">
          {isCreating ? (
            <Helmet title="Email Flow - Create" />
          ) : (
            <Helmet title="Email Flow - Edit" />
          )}

          {/* PAGE HEADER */}
          <Row
            type="flex"
            justify="center"
            style={{ paddingTop: 15, paddingLeft: 10, paddingRight: 10 }}
          >
            <Col span={23}>
              <PageHeader
                style={{
                  // backgroundColor: 'yellow',
                  marginBottom: -20,
                }}
                title={
                  <h2 className="font-weight-bold">
                    {emailFlowName}
                    {/* campaign-title */}
                  </h2>
                }
                subTitle={[
                  <Button
                    key="btnEdit"
                    type="default"
                    shape="circle"
                    size="small"
                    icon="edit"
                    onClick={this.openEditNameForm}
                  ></Button>,
                  <EmailflowEditNameForm
                    key="formEditEmailflowName"
                    wrappedComponentRef={this.saveEditNameFormRef}
                    visible={this.state.editEmailflowNameVisibility}
                    onCancel={this.editFormOnCancel}
                    onSave={this.editFormOnSave}
                  />,
                ]}
                extra={[
                  <Button key="btnLink" type="link" onClick={this.handlingFinishLater}>
                    Back
                  </Button>,

                  emailFlowStatus === Status.paused || emailFlowStatus === Status.available ? (
                    <Button key="btnSave" type="primary" icon="save" onClick={this.saveEmailFlow}>
                      Save
                    </Button>
                  ) : (
                    undefined
                  ),

                  emailFlowStatus === Status.paused || emailFlowStatus === Status.available ? (
                    <Button
                      key="btnStart"
                      type="primary"
                      icon="caret-right"
                      onClick={this.startEmailFlow}
                    >
                      Start
                    </Button>
                  ) : (
                    undefined
                  ),

                  emailFlowStatus === Status.running ? (
                    <Button key="btnPause" type="danger" icon="pause" onClick={this.pauseEmailFlow}>
                      Pause
                    </Button>
                  ) : (
                    undefined
                  ),

                  // <Button key="btnSave" type="primary" onClick={this.saveCampaign}>
                  //   Save
                  // </Button>,

                  // <Button key="btnStart" type="primary" onClick={this.startEmailFlow}>
                  //   Start
                  // </Button>,
                ]}
                tags={
                  <span>
                    {/* !currNewsletter
                        ? null
                        : [currNewsletter.status] */}
                    {!emailFlowStatus
                      ? null
                      : [emailFlowStatus].map(tag => {
                          let color = 'volcano'
                          if (tag === 'Available') {
                            color = 'green'
                          } else if (tag === 'Running') {
                            color = 'geekblue'
                          } else if (tag === 'Paused') {
                            color = 'red'
                          }
                          return (
                            <Tag color={color} key={tag}>
                              {tag.toUpperCase()}
                            </Tag>
                          )
                        })}
                  </span>
                }
              >
                <Descriptions size="small" column={1}>
                  {lastModifiedDate === null ? null : (
                    <Descriptions.Item label="Last modified">
                      <Moment format="MM/DD/YYYY HH:mm:ss">{lastModifiedDate}</Moment>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </PageHeader>
            </Col>
          </Row>
          {/* PAGE HEADER - END */}

          <Divider type="horizontal" />

          <Row type="flex" justify="center" className="card-body" style={{ fontSize: '1.3em' }}>
            <Col span={24}>
              {/* NODE START */}
              <Row type="flex" justify="center">
                <Col>
                  <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                    <Col
                    // style={{
                    //   backgroundColor: 'rgb(76,175,80)',
                    //   borderRadius: 5,
                    //   padding: 5,
                    //   color: 'white',
                    // }}
                    >
                      <span style={{ fontWeight: 'bold' }}>START</span>
                    </Col>
                  </Row>
                  <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                    <Col>
                      <Divider
                        type="vertical"
                        style={{ height: 20, backgroundColor: 'darkgray' }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* CHILDREN NODES - START STEP WAIT TIME */}
              <Row type="flex" justify="center">
                <Col>
                  <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                    <Col>
                      <WaitTimeForm
                        wrappedComponentRef={formRef => {
                          createRef((this.startStepWaitTimeFormRef = formRef))
                        }}
                        initialValue={startStepWaitTime}
                        onChange={this.startStepWaitTimeOnChange}
                      />
                    </Col>
                  </Row>
                  <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                    <Col>
                      <Divider
                        type="vertical"
                        style={{ height: 20, backgroundColor: 'darkgray' }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* CHILDREN NODES - START STEP ACTION */}
              <Row type="flex" justify="center">
                <Col>
                  <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                    <Col>
                      <ActionStepForm
                        wrappedComponentRef={formRef => {
                          createRef((this.startStepNewsletterFormRef = formRef))
                        }}
                        initialValue={startStepNewsletter}
                        selectedOnChange={this.startStepNewsletterSelectOnChange}
                        newsletterList={newsletterList}
                        loading={false}
                        layoutType="inline"
                      />
                    </Col>
                  </Row>
                  <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                    <Col>
                      <Divider
                        type="vertical"
                        style={{ height: 20, backgroundColor: 'darkgray' }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* CHILDREN NODES - CONDITION WAIT TIME */}
              <Row type="flex" justify="center">
                <Col>
                  <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                    <Col>
                      <WaitTimeForm
                        wrappedComponentRef={formRef => {
                          createRef((this.conditionStepWaitTimeFormRef = formRef))
                        }}
                        initialValue={conditionStepWaitTime}
                        onChange={this.conditionStepWaitTimeOnChange}
                      />
                    </Col>
                  </Row>
                  <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                    <Col>
                      <Divider
                        type="vertical"
                        style={{ height: 20, backgroundColor: 'darkgray' }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* CHILDREN NODES - CONDITION TYPE */}
              <Row type="flex" justify="center">
                <Col>
                  <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                    <Col>
                      <ConditionStepForm
                        wrappedComponentRef={formRef => {
                          createRef((this.conditionStepFormRef = formRef))
                        }}
                        initialValue={conditionStepType}
                        selectedOnChange={this.conditionStepTypeSelectOnChange}
                        loading={false}
                      />
                    </Col>
                  </Row>
                  <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                    <Col>
                      <Divider
                        type="vertical"
                        style={{ height: 20, backgroundColor: 'darkgray' }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* CHILDREN NODES - MATCHED/FAILED ACTION */}
              <Row type="flex" justify="center">
                <Col span={24}>
                  <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                    {/*  */}
                    {/* MATCHED ACTION */}
                    <Col
                      span={11}
                      // style={{ backgroundColor: 'yellow' }}
                    >
                      <Row type="flex" justify="center">
                        <Col span={24}>
                          <div
                            style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}
                          >
                            Matched
                          </div>

                          <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                            <Col>
                              <Divider
                                type="vertical"
                                style={{ height: 20, backgroundColor: 'darkgray' }}
                              />
                            </Col>
                          </Row>

                          {/* Matched condition wait time form */}
                          <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                            <WaitTimeForm
                              wrappedComponentRef={formRef => {
                                createRef((this.matchedStepWaitTimeFormRef = formRef))
                              }}
                              initialValue={matchedStepWaitTime}
                              onChange={this.matchedStepWaitTimeOnChange}
                            />
                          </Row>

                          <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                            <Col>
                              <Divider
                                type="vertical"
                                style={{ height: 20, backgroundColor: 'darkgray' }}
                              />
                            </Col>
                          </Row>

                          <Row type="flex" justify="center">
                            <ActionStepForm
                              wrappedComponentRef={formRef => {
                                createRef((this.matchedStepNewsletterFormRef = formRef))
                              }}
                              initialValue={matchedStepNewsletter}
                              selectedOnChange={this.matchedStepNewsletterSelectOnChange}
                              newsletterList={newsletterList}
                              loading={false}
                              layoutType="vertical"
                            />
                          </Row>
                        </Col>
                      </Row>
                    </Col>

                    <Col
                      span={2}
                      style={{
                        borderTop: '.5px solid darkgray',
                        borderBottom: '.5px solid darkgray',
                      }}
                    ></Col>

                    {/* FAILED ACTION */}
                    <Col
                      span={11}
                      // style={{ backgroundColor: 'yellow' }}
                    >
                      <Row type="flex" justify="center">
                        <Col span={24}>
                          <div
                            style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}
                          >
                            Failed
                          </div>

                          <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                            <Col>
                              <Divider
                                type="vertical"
                                style={{ height: 20, backgroundColor: 'darkgray' }}
                              />
                            </Col>
                          </Row>

                          <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                            <WaitTimeForm
                              wrappedComponentRef={formRef => {
                                createRef((this.failedStepWaitTimeFormRef = formRef))
                              }}
                              initialValue={failedStepWaitTime}
                              onChange={this.failedStepWaitTimeOnChange}
                            />
                          </Row>

                          <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                            <Col>
                              <Divider
                                type="vertical"
                                style={{ height: 20, backgroundColor: 'darkgray' }}
                              />
                            </Col>
                          </Row>

                          <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                            <ActionStepForm
                              wrappedComponentRef={formRef => {
                                createRef((this.failedStepNewsletterFormRef = formRef))
                              }}
                              initialValue={failedStepNewsletter}
                              selectedOnChange={this.failedStepNewsletterSelectOnChange}
                              newsletterList={newsletterList}
                              loading={false}
                              layoutType="vertical"
                            />
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
                    <Col>
                      <Divider
                        type="vertical"
                        style={{ height: 20, backgroundColor: 'darkgray' }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* NODE END */}
              <Row type="flex" justify="center">
                <Col
                // style={{
                //   backgroundColor: 'rgb(217,83,79)',
                //   borderRadius: 5,
                //   padding: 5,
                //   color: 'white',
                // }}
                >
                  <span style={{ fontWeight: 'bold' }}>END</span>
                </Col>
              </Row>
            </Col>
          </Row>
        </section>
      )
    } else {
      return (
        <Row type="flex" justify="center">
          {isCreating ? (
            <Helmet title="Email Flow - Create" />
          ) : (
            <Helmet title="Email Flow - Edit" />
          )}

          <Col span={12}>
            <Spin
              style={{
                // backgroundColor: 'yellow',
                width: '100%',
              }}
              spinning={pageLoading}
              tip="Loading ..."
              size="large"
            >
              <div style={{ height: 500 }}></div>
            </Spin>
          </Col>
        </Row>
      )
    }
  }
}

export default EmailflowHome
