/* eslint-disable */
import React, { createRef } from 'react'
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
  Pagination,
  List,
  Radio,
  Card,
  Tooltip,
} from 'antd'
import Moment from 'react-moment'
import styles from './style.module.scss'
// import SampleHtml from './temp/sample.html'

const { Step } = Steps
const FormItem = Form.Item
const { Option } = Select
const { confirm } = Modal

/* --------------------------------------------------------------- */

// TRACKING CONFIGURATION FORM

const TrackingConfigurationForm = Form.create({ name: 'tracking_config_form_in_modal' })(
  class extends React.Component {
    // Is Tracking Opened Email On Change
    isTrackingOpenedEmailOnChange = e => {
      let value = e.target.value
      console.log('isTrackingOpenedEmailValue', value)
      const currNewsletter = !localStorage.getItem('currNewsletter')
        ? null
        : JSON.parse(localStorage.getItem('currNewsletter'))
      currNewsletter.trackingConfig.isCheckingOpenedEmail = value
      localStorage.setItem('currNewsletter', JSON.stringify(currNewsletter))
    }

    isTrackingClickedUrlOnChange = e => {
      let value = e.target.value
      console.log('isTrackingClickedUrlValue', value)
      const currNewsletter = !localStorage.getItem('currNewsletter')
        ? null
        : JSON.parse(localStorage.getItem('currNewsletter'))
      currNewsletter.trackingConfig.isCheckingClickedUrl = value
      localStorage.setItem('currNewsletter', JSON.stringify(currNewsletter))
    }

    render() {
      // setTimeout(() => {}, 2000)
      console.log('TRACKING_CONFIG_FORM_PROPS', this.props)
      const { form } = this.props

      const currNewsletter = !localStorage.getItem('currNewsletter')
        ? null
        : JSON.parse(localStorage.getItem('currNewsletter'))

      console.log('TRACKING_CONFIG_FORM currNewsletter', currNewsletter)

      const trackingConfig = !currNewsletter.trackingConfig ? null : currNewsletter.trackingConfig

      const urlPrefixes = (
        <Select
          disabled={!trackingConfig.isCheckingClickedUrl}
          defaultValue="http://"
          style={{ width: 90 }}
        >
          <Option value="http://">http://</Option>
          <Option value="https://">https://</Option>
        </Select>
      )

      return (
        <Form layout="vertical">
          {/* Tracking Opened Email */}
          <div className="form-group">
            <FormItem label="Do you want to track whether your receivers have opened this newsletter or not?">
              {form.getFieldDecorator('isCheckingOpenedEmail', {
                initialValue: trackingConfig.isCheckingOpenedEmail,
                // rules: [{ required: false, message: 'Please input email subject' }],
              })(
                <Radio.Group
                  onChange={this.isTrackingOpenedEmailOnChange}
                  style={{ marginLeft: 20 }}
                >
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </div>

          {/* Tracking Clicked URL */}
          <div className="form-group">
            <FormItem label="Do you want to track whether your receivers have clicked a targeted URL in this newsletter or not?">
              {form.getFieldDecorator('isCheckingClickedUrl', {
                initialValue: trackingConfig.isCheckingClickedUrl,
                // rules: [{ required: false, message: 'Please input email subject' }],
              })(
                <Radio.Group
                  onChange={this.isTrackingClickedUrlOnChange}
                  style={{ marginLeft: 20 }}
                >
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </div>
        </Form>
      )
    }
  },
)

// TRACKING CONFIGURATION FORM- END

/* --------------------------------------------------------------- */

// NEWSLETTER SEND FORM

const AudienceSelectionForm = Form.create({ name: 'newsletter_send_form_in_modal' })(
  class extends React.Component {
    // When select
    audienceSelectOnchange = value => {
      console.log('AudienceSelectedValue', value)
      const currNewsletter = JSON.parse(localStorage.getItem('currNewsletter'))
      currNewsletter.selectedAudiences = value
      localStorage.setItem('currNewsletter', JSON.stringify(currNewsletter))
    }

    render() {
      // setTimeout(() => {}, 2000)
      console.log('AUDIENCE_SELECTION_FORM_PROPS', this.props)
      const { visible, onCancel, form } = this.props
      const { getFieldDecorator } = form

      // Getting audience list
      const audienceList = localStorage.getItem('newsletter_audienceList')
        ? JSON.parse(localStorage.getItem('newsletter_audienceList'))
        : null

      console.log('AUDIENCE_SELECTION_FORM audienceList', audienceList)
      const selectData = !audienceList ? null : audienceList

      const children = []
      if (selectData) {
        audienceList.forEach(audience => {
          children.push(<Option value={audience.id}>{audience.name}</Option>)
        })
      }

      const currNewsletter = !localStorage.getItem('currNewsletter')
        ? null
        : JSON.parse(localStorage.getItem('currNewsletter'))

      return (
        <Modal
          visible={visible}
          title="Select Audience"
          // okText="Save"
          onCancel={onCancel}
          okButtonProps={{ style: { display: 'none' } }}
          cancelButtonProps={{ style: { display: 'none' } }}
          // onOk={onSave}
        >
          <Form layout="vertical">
            <FormItem label="Audience">
              {getFieldDecorator('audience', {
                rules: [{ required: true, message: 'Please select at least a group of audience' }],
                initialValue: !currNewsletter ? [] : currNewsletter.selectedAudiences,
              })(
                <Select
                  style={{ flex: 1 }}
                  mode="multiple"
                  placeholder="Choose audience"
                  onChange={this.audienceSelectOnchange}
                  labelInValue={true}
                  size="large"
                  loading={!children[0] ? true : false}
                >
                  {children}
                  {/* <Option value="id_red">Red</Option>
                  <Option value="id_green">Green</Option>
                  <Option value="id_blue">Blue</Option> */}
                </Select>,
              )}
            </FormItem>
          </Form>
        </Modal>
      )
    }
  },
)

// NEWSLETTER SEND FORM - END

/* --------------------------------------------------------------- */

// NEWSLETTER EDIT NAME FORM

const NewsletterEditNameForm = Form.create({ name: 'edit_newsletter_name_in_modal' })(
  class extends React.Component {
    render() {
      const { visible, onCancel, onSave, form } = this.props
      const { getFieldDecorator } = form

      const currNewsletter = !localStorage.getItem('currNewsletter')
        ? null
        : JSON.parse(localStorage.getItem('currNewsletter'))

      return (
        <Modal
          visible={visible}
          title="Edit Newsletter Name"
          okText="Save"
          onCancel={onCancel}
          onOk={onSave}
        >
          <Form layout="vertical">
            <FormItem label="Newsletter Name">
              {getFieldDecorator('newsletterName', {
                rules: [{ required: true, message: 'Please input newsletter name' }],
                initialValue: !currNewsletter ? '' : currNewsletter.name,
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      )
    }
  },
)

// NEWSLETTER EDIT NAME FORM - END

/* --------------------------------------------------------------- */

// CHOOSE EMAIL TEMPLATE FORM

const ChooseEmailTemplateForm = Form.create({ name: 'choose_email_template_in_modal' })(
  class extends React.Component {
    render() {
      console.log('CHOOSE_EMAIL_TEMPLATE_MODAL_RENDER_PROPS', this.props)

      const { visible, onCancel, emailTemplateList, history } = this.props

      const listContent = !emailTemplateList ? [] : emailTemplateList

      let currNewsletter = !localStorage.getItem('currNewsletter')
        ? null
        : JSON.parse(localStorage.getItem('currNewsletter'))

      return (
        <Modal
          width={800}
          visible={visible}
          title="Choose an Email Template"
          footer={null}
          onCancel={onCancel}
          // okText="Next"
          // onOk={onNext}
        >
          <List
            loading={!emailTemplateList ? true : false}
            itemLayout="horizontal"
            grid={{ gutter: 16, column: 2 }}
            pagination={{
              position: 'bottom',
              pageSize: 2,
            }}
            dataSource={listContent}
            renderItem={item => (
              <List.Item key={item.id} style={{ overflow: 'hidden' }}>
                <Card
                  title={
                    <Tooltip title={item.name}>
                      {/* <Button id="btnFinishLater" type="link" onClick={cardTitleOnClick}> */}
                      <span
                        style={{ fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={() => {
                          console.log('CardTitleOnClick emailTemplate', item)
                          currNewsletter.email.htmlContent = item.body
                          currNewsletter.email.rawContent = item.raw_content
                          currNewsletter.email.subject = item.name
                          currNewsletter.email.templateId = item.id

                          console.log('CardTitleOnClick currNewsletter', currNewsletter)

                          localStorage.setItem('currNewsletter', JSON.stringify(currNewsletter))

                          history.push({
                            pathname: `/email/design`,
                          })
                        }}
                      >
                        {item.name}
                      </span>
                      {/* </Button> */}
                    </Tooltip>
                  }
                  bodyStyle={{ padding: 0 }}
                >
                  <div
                    style={{
                      margin: 0,
                      // overflow: 'hidden',
                      // paddingTop: '63%',
                      // position: 'relative',
                    }}
                  >
                    <iframe
                      srcDoc={item.body}
                      scrolling="auto"
                      style={{
                        height: 350,
                        width: '100%',
                        border: 0,
                        marginLeft: 1,
                        // position: 'absolute',
                        // left: 0,
                        // top: 0,
                        // scale: 0.7,
                        // transform: 'scale(.3)',
                      }}
                    />
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </Modal>
      )
    }
  },
)

// NEWSLETTER EDIT NAME FORM - END

/* --------------------------------------------------------------- */

// MAIN CODE
@Form.create({ name: 'email_form' })
@connect(({ newsletter }) => ({ newsletter }))
@connect(({ emailTemplate }) => ({ emailTemplate }))
class NewsletterEditPage extends React.Component {
  state = {
    history: this.props.history,
    dispatch: this.props.dispatch,
    current: 0,
    hasEmailContent: false,
    audienceSelectionFormVisibility: false,
    editNewsletterNameVisibility: false,
    chooseEmailTemplateFormVisibility: false,
    pageLoading: false,
    isSavedNewsletter: false,
    reload: false,
  }

  componentDidMount = () => {
    console.log('NEWSLETTER EDIT PAGE')
    console.log('ComponentDidMount Props', this.props)
    const { dispatch } = this.props

    console.log('STATE.isSavedNewsletter', this.state.isSavedNewsletter)
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps)
  }

  /* --------------------------------------------------------------- */

  // PAGE HEADER HANDLING FUNCTIONS

  handleFinishLater = () => {
    const { isSavedNewsletter } = this.state
    const props = this
    if (!isSavedNewsletter) {
      confirm({
        title: `Go back?`,
        content: `You have not saved current newsletter. Do you want to save?`,
        cancelText: 'No',
        okText: 'Yes',
        onOk() {
          console.log(`Save newsletter`)
          props.saveNewsletterContent()
          if (props.state.isSavedNewsletter === true) {
            // props.setState({ isSavedNewsletter: true })
            setTimeout(() => {
              window.history.back()
            }, 1000)
          }
        },
        onCancel() {
          console.log(`Cancel`)
          props.setState({ isSavedNewsletter: false })
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
  }

  openAudienceSelectionForm = () => {
    const { dispatch } = this.state

    // GET AUDIENCE LIST
    dispatch({
      type: 'newsletter/GET_ALL_AUDIENCE',
    })
    this.setState({ audienceSelectionFormVisibility: true })
  }

  openEditNameForm = () => {
    const { dispatch } = this.props

    console.log('OPEN EDIT NEWSLETTER NAME FORM')
    this.setState({ editNewsletterNameVisibility: true })
  }

  // Edit Newsletter form handling

  editFormOnCancel = async e => {
    e.preventDefault()
    const { form } = this.editNameFormRef.props
    console.log('editNameFormRef', form)

    let isValidated = await form
      .validateFields((err, values) => {})
      .then(() => {
        return true
      })
      .catch(() => {
        return false
      })

    console.log('isValidated', isValidated)

    if (isValidated) {
      this.setState({ editNewsletterNameVisibility: false })
      form.resetFields()
    }
  }

  editFormOnSave = async () => {
    // e.preventDefault()
    const { form } = this.editNameFormRef.props
    const { dispatch } = this.props

    let isValidated = await form
      .validateFields((err, values) => {})
      .then(values => {
        const currNewsletter = !localStorage.getItem('currNewsletter')
          ? null
          : JSON.parse(localStorage.getItem('currNewsletter'))

        currNewsletter.name = values.newsletterName
        console.log('Newsletter edited name:', currNewsletter.name)
        console.log('Newsletter Name Updated:', currNewsletter)
        localStorage.setItem('currNewsletter', JSON.stringify(currNewsletter))
        return true
      })
      .catch(() => {
        return false
      })

    console.log('isValidated', isValidated)

    if (isValidated) {
      this.setState({ isSavedNewsletter: false })
      this.setState({ editNewsletterNameVisibility: false })
      form.resetFields()
    }
  }

  // Send form handling

  sendNewsletter = e => {
    e.preventDefault()
    const { dispatch } = this.props
    const { isSavedNewsletter } = this.state
    // const saveNewsletter = this.saveNewsletterContent

    const currNewsletter = !localStorage.getItem('currNewsletter')
      ? null
      : JSON.parse(localStorage.getItem('currNewsletter'))

    let htmlContent = currNewsletter.email.htmlContent
    let rawContent = currNewsletter.email.rawContent
    if (htmlContent === '' && rawContent === '') {
      notification.warning({
        message: 'Please add your newsletter content before sending this newsletter',
      })
      return
    }

    let selectedAudiences = currNewsletter.selectedAudiences
    if (!selectedAudiences[0]) {
      notification.warning({
        message: 'Please choose your recipients before sending this newsletter',
      })
      return
    }

    if (isSavedNewsletter === false) {
      notification.warning({
        message: 'Please save your newsletter before sending this newsletter',
      })
    } else {
      console.log('send mail')
      // const currNewsletter = JSON.parse(localStorage.getItem('currNewsletter'))
      dispatch({
        type: 'newsletter/SEND_MAIL',
        payload: currNewsletter,
      })
    }
  }

  audienceSelectionFormOnCancel = async e => {
    e.preventDefault()
    const { form } = this.audienceSelectionFormRef.props

    this.setState({ audienceSelectionFormVisibility: false })
    form.resetFields()
    localStorage.removeItem('newsletter_audienceList')
    this.props.newsletter.audienceList = null
  }

  // Choose email template form handling
  saveChooseEmailTemplateFormRef = formRef => {
    this.chooseEmailTemplateFormRef = formRef
  }

  chooseEmailTemplateFormOnCancel = () => {
    this.setState({ chooseEmailTemplateFormVisibility: false })
    !this.props.emailTemplate.emailTemplateList
      ? null
      : (this.props.emailTemplate.emailTemplateList = null)
  }

  // PAGE HEADER HANDLING FUNCTIONS -- END

  /* --------------------------------------------------------------- */

  // PAGE BODY HANDLING FUNCTIONS

  onStepChange = current => {
    console.log('onChange:', { current })
    this.setState({ current })
  }

  emailFromSelectOnChange = value => {
    console.log('EmailFromSelectedValue', value)
    const currNewsletter = !localStorage.getItem('currNewsletter')
      ? null
      : JSON.parse(localStorage.getItem('currNewsletter'))

    currNewsletter.email.from = value
    console.log('Newsletter Selected Email From Changed', currNewsletter)
    localStorage.setItem('currNewsletter', JSON.stringify(currNewsletter))

    this.setState({ isSavedNewsletter: false })
  }

  emailSubjectOnChange = e => {
    const value = e.target.value
    // console.log('EmailSubjectValueChange', value)
    const currNewsletter = !localStorage.getItem('currNewsletter')
      ? null
      : JSON.parse(localStorage.getItem('currNewsletter'))

    currNewsletter.email.subject = value
    // console.log('Newsletter Selected Email From Changed', currNewsletter)
    localStorage.setItem('currNewsletter', JSON.stringify(currNewsletter))

    this.setState({ isSavedNewsletter: false })
  }

  designEmailContent = () => {
    this.setState({ chooseEmailTemplateFormVisibility: true })

    this.state.dispatch({
      type: 'emailTemplate/GET_EMAIL_TEMPLATES',
    })
    // this.state
  }

  editEmailContent = () => {
    this.setState({ isSavedNewsletter: false })
    this.state.history.push({
      pathname: '/email/design',
    })
  }

  saveNewsletterContent = async () => {
    const { form, dispatch } = this.props

    console.log('Save Newsletter trackingConfigFormRef', this.trackingConfigFormRef)
    const trackingConfigForm = this.trackingConfigFormRef.props.form

    const currNewsletter = JSON.parse(localStorage.getItem('currNewsletter'))

    let isTrackingConfigFormValidated = await trackingConfigForm
      .validateFields((err, values) => {
        if (err) {
          console.log(err)
          this.state.isSavedNewsletter = false
          this.setState({ reload: false })
          return
        }

        console.log('TrackingFormValues', values)
      })
      .then(values => {
        return true
      })
      .catch(error => {
        console.log(error)
        this.state.isSavedNewsletter = false
        // this.setState({ reload: false })
        return false
      })

    if (!isTrackingConfigFormValidated) {
      return
    }

    let isValidated = await form
      .validateFields((err, values) => {
        // this.state.current = 1
      })
      .then(values => {
        console.log('newsletter form values', values)

        const currNewsletter = JSON.parse(localStorage.getItem('currNewsletter'))

        console.log('current newsletter for saving to DB:', currNewsletter)
        return true
      })
      .catch(error => {
        this.state.isSavedNewsletter = false
        this.setState({ reload: false })
        return false
      })

    if (isValidated) {
      dispatch({
        type: 'newsletter/UPDATE_NEWSLETTER',
        payload: currNewsletter,
      })

      this.state.isSavedNewsletter = true
      this.state.reload = true
    }
  }

  // Tracking Config Form handling

  // PAGE BODY HANDLING FUNCTIONS -- END

  /* --------------------------------------------------------------- */

  // MAIN RENDERING
  render() {
    console.log('NEWSLETTER EDIT PAGE render props', this.props)
    const { pageLoading } = this.props.newsletter

    const currNewsletter = !localStorage.getItem('currNewsletter')
      ? null
      : JSON.parse(localStorage.getItem('currNewsletter'))

    const { current, dispatch, isSavedNewsletter, reload } = this.state
    const { form } = this.props

    const email = !currNewsletter ? null : currNewsletter.email

    if (email) {
      if (email.htmlContent !== '') {
        this.state.hasEmailContent = true
      } else {
        this.state.hasEmailContent = false
      }
    }

    // Reloading data
    if (reload === true) {
      const trackingConfigForm = this.trackingConfigFormRef.props.form

      setTimeout(() => {
        console.log('RELOADING', this.state.isSavedNewsletter)
        // this.setState({ isSavedNewsletter: true })
        this.setState({ reload: false })

        dispatch({
          type: 'newsletter/GET_NEWSLETTER_BY_ID',
          payload: {
            selectedNewsletter: currNewsletter.id,
          },
        })
      }, 2200)

      setTimeout(() => {
        trackingConfigForm.resetFields()
      }, 2000)
    }

    if (!currNewsletter) {
      // SHOW LOADING
      return (
        <section className="card">
          <Helmet title="Create Newsletter" />
          <Row type="flex" justify="center">
            <Col span={12}>
              <Spin
                style={{
                  // backgroundColor: 'yellow',
                  width: '100%',
                }}
                spinning={!currNewsletter || pageLoading ? true : false}
                tip="Loading ..."
                size="large"
              >
                <div style={{ height: 500 }}></div>
              </Spin>
            </Col>
          </Row>
        </section>
      )
    } else {
      return (
        <section className="card">
          {/* handle if create show create, if edit show edit */}
          <Helmet title="Create Newsletter" />

          {/* PAGE HEADER */}

          <Row
            type="flex"
            justify="center"
            style={{ paddingTop: 15, paddingLeft: 10, paddingRight: 10 }}
          >
            <Col span={24}>
              <PageHeader
                title={
                  <h2 className="font-weight-bold" style={{ maxWidth: 320, overflow: 'hidden' }}>
                    {!currNewsletter ? null : currNewsletter.name}
                  </h2>
                }
                // Edit newsletter name
                subTitle={[
                  <Button
                    type="default"
                    size="small"
                    shape="circle"
                    onClick={this.openEditNameForm}
                    icon="edit"
                  ></Button>,
                  <NewsletterEditNameForm
                    wrappedComponentRef={formRef => {
                      createRef((this.editNameFormRef = formRef))
                    }}
                    visible={this.state.editNewsletterNameVisibility}
                    onCancel={this.editFormOnCancel}
                    onSave={this.editFormOnSave}
                  />,
                ]}
                // Header buttons
                extra={[
                  <Button id="btnFinishLater" type="link" onClick={this.handleFinishLater}>
                    Back
                  </Button>,
                  <Button
                    id="btnSelectAudience"
                    type="default"
                    icon="team"
                    onClick={this.openAudienceSelectionForm}
                  >
                    Select Receivers
                  </Button>,

                  <Button
                    id="btnSave"
                    type="primary"
                    icon="save"
                    onClick={() => {
                      this.saveNewsletterContent()
                      this.state.reload = true
                    }}
                  >
                    Save
                  </Button>,

                  <Button
                    id="btnSend"
                    type="primary"
                    // icon="team"
                    onClick={this.sendNewsletter}
                  >
                    Send Now
                  </Button>,

                  <AudienceSelectionForm
                    wrappedComponentRef={formRef => {
                      createRef((this.audienceSelectionFormRef = formRef))
                    }}
                    visible={this.state.audienceSelectionFormVisibility}
                    onCancel={this.audienceSelectionFormOnCancel}
                  />,
                ]}
                // Status
                tags={
                  <span>
                    {!currNewsletter
                      ? null
                      : [currNewsletter.status].map(tag => {
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
                {/* Last modified date */}
                <Descriptions size="small" column={1}>
                  <Descriptions.Item label="Last modified">
                    <Moment format="MM/DD/YYYY HH:mm:ss">
                      {!currNewsletter ? null : currNewsletter.last_modified_date}
                    </Moment>
                  </Descriptions.Item>
                </Descriptions>
              </PageHeader>
            </Col>
          </Row>

          {/* PAGE HEADER - END */}

          <Divider type="horizontal" />

          {/* PAGE BODY */}

          <Row
            type="flex"
            justify="center"
            style={{ paddingTop: 15, paddingLeft: 10, paddingRight: 10 }}
          >
            <Col span={22}>
              <Steps
                current={current}
                onChange={this.onStepChange}
                direction="vertical"
                // initial={2}
              >
                {/* TRACKING CONFIG */}
                <Step
                  status="finish"
                  title={<h3>Tracking Configuration</h3>}
                  icon={
                    <span>
                      <Icon type="setting" theme="outlined" />
                      {/* <Icon type="setting" theme="filled" /> */}
                    </span>
                  }
                  description={
                    <Row className="card-body" type="flex" justify="center">
                      <Col span={24}>
                        <TrackingConfigurationForm
                          wrappedComponentRef={formRef => {
                            createRef((this.trackingConfigFormRef = formRef))
                          }}
                        />
                      </Col>
                    </Row>
                  }
                />
                {/* NEWSLETTER FORM */}
                <Step
                  status="finish"
                  title={<h3>Newsletter Form</h3>}
                  icon={
                    <span>
                      <Icon type="form" theme="outlined" />
                      {/* <Icon type="setting" theme="filled" /> */}
                    </span>
                  }
                  description={
                    <Row className="card-body" type="flex" justify="center">
                      <Col span={24}>
                        <Form className="mt-3" layout="vertical">
                          {/* Email Address for Sending Newsletter */}
                          <div className="form-group">
                            <FormItem label="Email Address for Sending Newsletter">
                              {form.getFieldDecorator('from', {
                                initialValue: email ? email.from : '',
                                rules: [
                                  { required: true, message: 'Please select an email address' },
                                ],
                              })(
                                <Select
                                  showSearch
                                  showArrow
                                  placeholder="Choose an email"
                                  onChange={this.emailFromSelectOnChange}
                                >
                                  <Option
                                    key="1"
                                    value="EMM_Capstone_Project <vinhnqse63033@fpt.edu.vn>"
                                  >
                                    EMM_Capstone_Project &#60;vinhnqse63033@fpt.edu.vn&#62;
                                  </Option>
                                </Select>,
                              )}
                            </FormItem>
                          </div>

                          {/* Email Subject */}
                          <div className="form-group">
                            <FormItem label="Subject">
                              {form.getFieldDecorator('subject', {
                                initialValue: email ? email.subject : '',
                                rules: [{ required: true, message: 'Please input email subject' }],
                              })(
                                <Input
                                  placeholder="Email subject"
                                  onChange={this.emailSubjectOnChange}
                                  allowClear={true}
                                />,
                              )}
                            </FormItem>
                          </div>

                          {/* Email Content */}
                          <div className="form-group">
                            {/* Append Edit Email Content btn if has email content */}
                            <Row justify="end" type="flex">
                              {this.state.hasEmailContent ? (
                                <Row justify="end" type="flex">
                                  <Button type="primary" onClick={this.editEmailContent}>
                                    <span>
                                      <i
                                        style={{ marginRight: 10 }}
                                        className="icmn icmn-file-text2"
                                      />
                                      Edit Email Content
                                    </span>
                                  </Button>
                                </Row>
                              ) : (
                                <Row justify="end" type="flex"></Row>
                              )}
                            </Row>

                            {/* Display email content */}
                            <FormItem label="Content">
                              <div className={styles.editor}>
                                {!this.state.hasEmailContent ? (
                                  <Empty
                                    style={{ paddingTop: 20, paddingBottom: 20 }}
                                    image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
                                    imageStyle={{
                                      height: 60,
                                    }}
                                    description={<span>Email Content is empty</span>}
                                  >
                                    <Button type="primary" onClick={this.designEmailContent}>
                                      <span>
                                        <i
                                          style={{ marginRight: 10 }}
                                          className="icmn icmn-file-text2"
                                        />
                                        Design Email Content
                                      </span>
                                    </Button>
                                    <ChooseEmailTemplateForm
                                      wrappedComponentRef={this.saveChooseEmailTemplateFormRef}
                                      visible={this.state.chooseEmailTemplateFormVisibility}
                                      onCancel={this.chooseEmailTemplateFormOnCancel}
                                      emailTemplateList={
                                        !this.props.emailTemplate.emailTemplateList
                                          ? null
                                          : this.props.emailTemplate.emailTemplateList
                                      }
                                      history={this.state.history}
                                      // audienceList={audienceList}
                                    />
                                  </Empty>
                                ) : (
                                  <Row type="flex" justify="center">
                                    <iframe
                                      height="730px"
                                      width="100%"
                                      frameBorder="0"
                                      marginHeight="20"
                                      marginWidth="35"
                                      scrolling="auto"
                                      srcDoc={email.htmlContent}
                                    ></iframe>
                                  </Row>
                                )}
                              </div>
                            </FormItem>
                          </div>
                        </Form>
                      </Col>
                    </Row>
                  }
                />

                {/* EMPTY */}
                <Step status="finish" style={{ display: 'none' }} />
              </Steps>
            </Col>
          </Row>

          {/* PAGE BODY -- END */}
        </section>
      )
    }
  }
}

export default NewsletterEditPage
