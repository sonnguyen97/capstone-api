/* eslint-disable */
import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import {
  PageHeader,
  Row,
  Col,
  Button,
  Tag,
  Divider,
  Input,
  Form,
  Modal,
  message,
  Icon,
  Select,
  Spin,
  Radio,
  TimePicker,
  Checkbox,
  Descriptions,
} from 'antd'
import moment from 'moment'
import Moment from 'react-moment'

const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item
const { Option } = Select

/* --------------------------------------------------------------- */

const CampaignUpdateNameForm = Form.create({ name: 'update_campaign_name_in_modal' })(
  class extends React.Component {
    render() {
      const { visible, onCancel, onSave, form } = this.props
      const { getFieldDecorator } = form

      const campaignName = !localStorage.getItem('campaignName')
        ? null
        : localStorage.getItem('campaignName')

      return (
        <Modal
          visible={visible}
          title="Campaign name"
          okText="Save"
          onCancel={onCancel}
          onOk={onSave}
        >
          <Form layout="vertical">
            <FormItem label="Campaign Name">
              {getFieldDecorator('campaignName', {
                rules: [{ required: true, message: 'Please input campaign name' }],
                initialValue: !campaignName ? '' : campaignName,
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      )
    }
  },
)
/* --------------------------------------------------------------- */

// MAIN CODE

@connect(({ audience }) => ({ audience }))
@connect(({ newsletter }) => ({ newsletter }))
@connect(({ campaign }) => ({ campaign }))
@Form.create({ name: 'updateCampaign_form' })
class UpdateCampaign extends React.Component {
  state = {
    //  eslint-disable-next-line
    history: this.props.history,
    current: 0,
    visible: false,
    curTime: new Date().toLocaleString(),
    editCampaignNameVisibility: false,
    formVisibleWeekly: false,
    formVisibleMonthly: false,
    formVisibleDaily: false,
    disableIsRunning: false,
    Weekly: false,
    Daily: false,
    Monthly: false,
    check: false,
    // value: this.props.campaign.campaignObj.sendType,
    // campaignObj: localStorage.getItem('campaignObjUpdate')
  }

  componentDidMount = () => {
    const { dispatch } = this.props
    const id = localStorage.getItem('campaignId')
    dispatch({
      type: 'campaign/GET_CAMPAIGN_BY_ID',
      payload: { id },
    })
    dispatch({
      type: 'audience/GET_AUDIENCE',
    })
    dispatch({
      type: 'newsletter/GET_NEWSLETTERS',
    })
    // this.state.isUnmount === true
    // dispatch({
    //   type: 'campaign/GET_CAMPAIGN_BY_ID',
    //   payload: { id }
    // })
    // localStorage.removeItem('campaignName')
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps)
  }

  /* --------------------------------------------------------------- */

  // PAGE HEADER HANDLING FUNCTIONS
  openEditNameForm = () => {
    this.setState({
      visible: true,
    })
  }

  handlingFinishLater = () => {
    window.history.back()
  }

  updateCampaign = e => {
    message.success('Created campaign successfully')
    const { dispatch } = this.props
    e.preventDefault()
    // eslint-disable-next-line
    this.props.form.validateFieldsAndScroll((err, values) => {
      values.campaignName = localStorage.getItem('campaignName')
      values.campaignId = localStorage.getItem('campaignId')
      // eslint-disable-next-line
      if (!err) {
        // this.state.StepData.campaignName = localStorage.getItem('campaignName')
        // this.state.StepData.id = campaign.id
        dispatch({
          type: 'campaign/UPDATE_CAMPAIGN',
          payload: values,
        })
      }
    })
  }

  // startCampaign = () => {
  //   const { dispatch, campaign, status } = this.props
  //   let statusCampaign = { id: '', campaignId: '' }
  //   if (status.name === 'Running') {
  //     statusCampaign.id = 'bd1b5402-4de9-44b3-8804-38b8ff271a17'
  //   }
  //   if (status.name !== 'Running') {
  //     statusCampaign.id = '4cece002-1ae6-4bad-9633-ab30dc55b4e5'
  //   }
  //   statusCampaign.campaignId = localStorage.getItem('campaignId')
  //   dispatch({
  //     type: 'campaign/START_STOP_CAMPAIGN',
  //     payload: statusCampaign,
  //   })
  // }

  showConfirm = () => {
    const { dispatch, campaign } = this.props
    const { status } = campaign
    let statusCampaign = { id: '', name: '', campaignId: '' }
    if (status.name === 'Paused' || status.name === 'Available') {
      statusCampaign.id = '4cece002-1ae6-4bad-9633-ab30dc55b4e5'
      statusCampaign.name = 'start'
    }
    if (status.name === 'Running') {
      statusCampaign.id = 'bd1b5402-4de9-44b3-8804-38b8ff271a17'
      statusCampaign.name = 'pause'
    }
    statusCampaign.campaignId = localStorage.getItem('campaignId')
    Modal.confirm({
      title: `Do you want to ${statusCampaign.name} right now?`,
      //  eslint-disable-next-line
      // content: `!`,
      onOk() {
        dispatch({
          type: 'campaign/START_STOP_CAMPAIGN',
          payload: statusCampaign,
        })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  // PAGE HEADER HANDLING FUNCTIONS -- END

  /* --------------------------------------------------------------- */

  // PAGE BODY HANDLING FUNCTIONS

  onStepChange = current => {
    console.log('onStepChange:', { current })
    this.setState({ current })
  }

  // NEW SUBSCRIPTION
  saveNewSubscriptionSelectNewsletterFormRef = formRef => {
    this.saveNewSubscriptionSelectNewsletterFormRef = formRef
  }

  newSubscriptionSelectedOnChange = value => {
    console.log('New Subscription Selected', value)
    console.log('New Subscription Selected', this.state.StepData)
    this.state.StepData.newSubscription = value
  }

  // PAID ORDER
  savePaidOrderSelectNewsletterFormRef = formRef => {
    this.savePaidOrderSelectNewsletterFormRef = formRef
  }

  paidOrderSelectedOnChange = value => {
    console.log('Paid Order Selected', value)
    this.state.StepData.paidOrder = value
  }

  // ABANDONED CHECKOUT
  saveAbandonedCheckoutSelectNewsletterFormRef = formRef => {
    this.saveAbandonedCheckoutSelectNewsletterFormRef = formRef
  }

  abandonedCheckoutSelectedOnChange = value => {
    console.log('Abandoned Checkout Selected', value)
    this.state.StepData.abandonedCheckout = value
  }

  // CANCELLED ORDER
  saveCancelledOrderSelectNewsletterFormRef = formRef => {
    this.saveCancelledOrderSelectNewsletterFormRef = formRef
  }

  cancelledOrderSelectedOnChange = value => {
    console.log('Cancelled Order Selected', value)
    this.state.StepData.cancelledOrder = value
  }

  // AD NEWSLETTERS
  saveAdNewsletterSelectNewsletterFormRef = formRef => {
    this.saveAdNewsletterSelectNewsletterFormRef = formRef
  }

  adNewsletterSelectedOnChange = value => {
    console.log('Ad Newsletter Selected', value)
    this.state.StepData.adNewsletter = value
  }

  // Edit Newsletter form handling
  saveEditNameFormRef = formRef => {
    this.editNameFormRef = formRef
  }

  openEditNameForm = () => {
    const { dispatch } = this.props

    console.log('OPEN EDIT NEWSLETTER NAME FORM')
    this.setState({ editCampaignNameVisibility: true })
  }

  editFormOnCancel = e => {
    e.preventDefault()
    this.setState({ editCampaignNameVisibility: false, visible: true })
  }

  editFormOnSave = () => {
    const { form } = this.editNameFormRef.props
    // const { dispatch } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Campaign name: ', values)
        localStorage.setItem('campaignName', values.campaignName)
        const { dispatch } = this.props
        dispatch({
          type: 'campaign/EDIT_CAMPAIGN_NAME',
          payload: values,
        })
        this.setState({ editCampaignNameVisibility: false })
      }
    })
  }

  disabledPreviousDate = start => {
    // const { startValue } = this.state;
    const now = moment().subtract(1, 'days')
    if (!start || !now) {
      return false
    }
    return start.valueOf() <= now.valueOf()
  }

  onChange = e => {
    this.setState({ value: e.target.value, check: true })
    switch (e.target.value) {
      case 'Weekly':
        this.state.formVisibleWeekly = true
        this.state.formVisibleMonthly = false
        this.state.Monthly = false
        break
      case 'Monthly':
        this.state.formVisibleMonthly = true
        this.state.formVisibleWeekly = false
        this.state.Weekly = false
        break
      case 'Daily':
        this.state.formVisibleDaily = true
        this.state.formVisibleMonthly = false
        this.state.formVisibleWeekly = false
        this.state.Monthly = false
        this.state.Weekly = false
        break
    }
  }

  /* --------------------------------------------------------------- */

  // MAIN RENDERING
  render() {
    console.log('CAMPAIGN EDIT PAGE render props', this.props)
    const { getFieldDecorator } = this.props.form
    const { newsletter, audience, campaign } = this.props
    // const { campaignObj } = campaign
    const { status } = campaign
    const campaignObj = !JSON.parse(localStorage.getItem('campaignObjUpdate'))
      ? null
      : JSON.parse(localStorage.getItem('campaignObjUpdate'))
    const { newsletterList } = newsletter
    const { audienceData } = audience
    // const { campaignObj } = campaign
    const dayOfWeeks = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Saturday',
      'Friday',
      'Sunday',
    ]
    const { dayOfWeek } = campaignObj
    // const dayOfWeekChecked = dayOfWeek
    const { sendType } = campaignObj
    const { mins } = campaignObj
    const { days } = campaignObj
    const hours = campaignObj.hours
    const { newsLetter } = campaignObj
    const { audienceObj } = campaignObj
    const { res } = campaignObj
    const { Campaign } = res

    // console.log(sendType)
    if (this.state.check !== true)
      switch (sendType) {
        case 'Weekly':
          this.state.Weekly = true
          this.state.Monthly = false
          break
        case 'Monthly':
          this.state.Monthly = true
          this.state.Weekly = false
          break
        case 'Daily':
          this.state.Daily = true
          this.state.Monthly = false
          this.state.Weekly = false
          break
      }

    const days31 = []
    for (let i = 1; i <= 31; i += 1) {
      // return (
      days31.push(
        <Option value={i} key={i}>
          {i}
        </Option>,
      )
      // )
    }

    const newsletterChildren = []
    if (newsletterList) {
      newsletterList.forEach(item => {
        newsletterChildren.push(
          <Option key={item.id} value={item.id}>
            {item.name}
          </Option>,
        )
      })
    }

    const audienceChildren = []
    if (audienceData) {
      audienceData.forEach(item => {
        audienceChildren.push(
          <Option key={item.id} value={item.id}>
            {item.name}
          </Option>,
        )
      })
    }

    if (status) {
      return (
        <section className="card">
          <Helmet title="Update Campaign" />

          {/* PAGE HEADER */}

          <Row
            type="flex"
            justify="center"
            style={{ paddingTop: 15, paddingLeft: 10, paddingRight: 10 }}
          >
            <Col span={24}>
              <PageHeader
                //   style={{ backgroundColor: 'black' }}
                title={
                  <h2 className="font-weight-bold">
                    {!localStorage.getItem('campaignName')
                      ? null
                      : localStorage.getItem('campaignName')}
                    {/* campaign-title */}
                  </h2>
                }
                subTitle={[
                  <Button
                    disabled={status.name === 'Running' ? true : false}
                    key="btnEdit"
                    type="default"
                    shape="circle"
                    size="small"
                    icon="edit"
                    onClick={this.openEditNameForm}
                  ></Button>,
                  <CampaignUpdateNameForm
                    key="formEditCampaignName"
                    wrappedComponentRef={this.saveEditNameFormRef}
                    visible={this.state.editCampaignNameVisibility}
                    onCancel={this.editFormOnCancel}
                    onSave={this.editFormOnSave}
                  />,
                ]}
                extra={[
                  <Button key="btnLink" type="link" onClick={this.handlingFinishLater}>
                    Back
                  </Button>,

                  <Button
                    disabled={status.name === 'Running' ? true : false}
                    key="btnSave"
                    type="primary"
                    onClick={this.updateCampaign}
                  >
                    <Icon type="save" /> Save
                  </Button>,

                  <Button
                    key="btnStart"
                    type={
                      status.name === 'Available' || status.name === 'Paused' ? 'primary' : 'danger'
                    }
                    onClick={this.showConfirm}
                  >
                    {status.name === 'Available' || status.name === 'Paused' ? (
                      <Icon type="caret-right" />
                    ) : (
                      <Icon type="pause" />
                    )}
                    {status.name === 'Available' || status.name === 'Paused' ? `Start` : `Pause`}
                  </Button>,
                ]}
                tags={
                  <span>
                    {!status.name
                      ? null
                      : [status.name].map(tag => {
                          let color = 'volcano'
                          if (tag === 'Available') {
                            color = 'green'
                          } else if (tag === 'Running') {
                            color = 'blue'
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
                  {!Campaign ? null : (
                    <Descriptions.Item label="Last modified">
                      <Moment format="MM/DD/YYYY HH:mm">
                        {!Campaign.last_modified_date ? null : Campaign.last_modified_date}
                      </Moment>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </PageHeader>
            </Col>
          </Row>

          {/* PAGE HEADER -- END */}

          <Divider type="horizontal" />

          {/* PAGE BODY */}

          <Row
            type="flex"
            justify="center"
            style={{ paddingTop: 15, paddingLeft: 10, paddingRight: 10 }}
          >
            <Col span={20}>
              <Fragment>
                <h4>Advertising/Promotion/Strategic Newsletters</h4>
                <p>
                  Select this option, selected newsletters will be send to subscribers in selected
                  groups of audiences
                </p>

                <Divider type="horizontal" />
                <Row type="flex" justify="center">
                  <Col span={18}>
                    <Form>
                      <FormItem label="Select Newsletter">
                        {getFieldDecorator('SelectedNewsletter', {
                          rules: [{ required: true, message: 'Please select an newsletter' }],
                          initialValue: newsLetter
                            ? [
                                <Option key={newsLetter.id} value={newsLetter.id}>
                                  {newsLetter.name}
                                </Option>,
                              ]
                            : [],
                        })(
                          <Select
                            style={{ flex: 1 }}
                            placeholder="Choose an newsletter"
                            labelInValue={true}
                            size="large"
                            loading={false}
                            disabled={status.name === 'Running' ? true : false}
                          >
                            {newsletterChildren}
                          </Select>,
                        )}
                      </FormItem>
                      <FormItem label="Audience">
                        {getFieldDecorator('SelectedAudience', {
                          rules: [{ required: true, message: 'Please select audience' }],
                          initialValue: audienceObj
                            ? [
                                <Option key={audienceObj.id} value={audienceObj.id}>
                                  {audienceObj.name}
                                </Option>,
                              ]
                            : [],
                        })(
                          <Select
                            style={{ flex: 1 }}
                            placeholder="Choose an audience"
                            // onChange={selectedOnChange}
                            labelInValue={true}
                            size="large"
                            loading={false}
                            disabled={status.name === 'Running' ? true : false}
                          >
                            {audienceChildren}
                          </Select>,
                        )}
                      </FormItem>
                      <FormItem>
                        {getFieldDecorator('sendType', {
                          // rules: [{ required: true, message: 'Please choose one' }],
                          initialValue: sendType,
                        })(
                          <Radio.Group
                            onChange={this.onChange}
                            disabled={status.name === 'Running' ? true : false}
                          >
                            <Radio value={'Daily'}>Daily</Radio>
                            <Radio value={'Weekly'}>Weekly</Radio>
                            <Radio value={'Monthly'}>Monthly</Radio>
                          </Radio.Group>,
                        )}
                      </FormItem>
                      {/* weekly */}
                      {this.state.formVisibleWeekly || this.state.Weekly ? (
                        <FormItem label="Day of week">
                          {getFieldDecorator('sendWeekChooseDays', {
                            rules: [{ required: true, message: 'Please choose send date' }],
                            initialValue: dayOfWeek,
                          })(
                            <CheckboxGroup
                              disabled={status.name === 'Running' ? true : false}
                              options={dayOfWeeks}
                              // onChange={this.onChangeDayOfWeek}
                            />,
                          )}
                        </FormItem>
                      ) : (
                        ''
                      )}
                      {/* monthly */}
                      {/* {this.state.formVisibleMonthly || this.state.Monthly ? (
                        <FormItem label="First/Last day of month">
                          {getFieldDecorator('sendMonthFirstLast', {
                            rules: [{ required: true, message: 'Please choose send date' }],
                            initialValue: 'first',
                          })(
                            <Radio.Group disabled={status.name === 'Running' ? true : false}>
                              <Radio value={'first'}>First</Radio>
                              <Radio value={'last'}>Last</Radio>
                            </Radio.Group>,
                          )}
                        </FormItem>
                      ) : (
                          ''
                        )} */}
                      {this.state.formVisibleMonthly || this.state.Monthly ? (
                        <FormItem label="Day of month">
                          {getFieldDecorator('sendMonthFirstLast', {
                            rules: [{ required: true, message: 'Please choose send day' }],
                            initialValue: [
                              <Option key={days} value={days}>
                                {days}
                              </Option>,
                            ],
                          })(
                            <Select
                              style={{ flex: 1 }}
                              placeholder="Choose an audience"
                              // onChange={selectedOnChange}
                              labelInValue={true}
                              size="large"
                              loading={false}
                              disabled={status.name === 'Running' ? true : false}
                            >
                              {days31}
                            </Select>,
                          )}
                        </FormItem>
                      ) : (
                        ''
                      )}

                      {/* all */}
                      <FormItem label="Send time">
                        {getFieldDecorator('sendTime', {
                          rules: [{ required: true, message: 'Please choose send time' }],
                          initialValue: moment(
                            `${!hours ? '00' : hours}:${!mins ? '00' : mins}`,
                            'HH:mm',
                          ),
                        })(
                          <TimePicker
                            disabled={status.name === 'Running' ? true : false}
                            format="HH:mm"
                            size="large"
                          />,
                        )}
                      </FormItem>
                      {/* {this.state.formVisibleDaily ?
                        <FormItem label="Re-send in">
                          {getFieldDecorator('reSendIn', {
                            rules: [{ required: true, message: 'Please select re-send in' }],
                            initialValue: 5,
                          })(
                            // <Fragment>
                            <div>
                              <InputNumber min={1} max={48} value={5} />
                              <span style={{ marginLeft: 10 }}>day(s)</span>
                            </div>,
                            // </Fragment>,
                          )}
                        </FormItem> : ''} */}
                    </Form>
                  </Col>
                </Row>

                <Divider type="horizontal" />
              </Fragment>
            </Col>
          </Row>
        </section>
      )
    } else {
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
                spinning={!status ? true : false}
                tip="Loading ..."
                size="large"
              >
                <div style={{ height: 500 }}></div>
              </Spin>
            </Col>
          </Row>
        </section>
      )
    }
  }
}

export default UpdateCampaign
