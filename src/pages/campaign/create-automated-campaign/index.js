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
  Descriptions,
  Steps,
  Select,
  Spin,
} from 'antd'

const { Step } = Steps
const FormItem = Form.Item
const { Option } = Select
// const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY']
/* --------------------------------------------------------------- */

const SelectNewsletterForm = Form.create({ name: 'select_newsletter_form' })(
  class extends React.Component {
    render() {
      const {
        form,
        formLabel,
        fieldName,
        isFieldRequired,
        fieldRequiredMsg,
        initialFieldValue,
        selectMode,
        selectPlaceholder,
        selectedOnChange,
        newsletterList,
        loading,
      } = this.props
      const { getFieldDecorator } = form

      return (
        <Form layout="vertical">
          <FormItem label={formLabel}>
            {getFieldDecorator(fieldName, {
              rules: [{ required: isFieldRequired, message: fieldRequiredMsg }],
              initialValue: initialFieldValue,
            })(
              <Select
                style={{ flex: 1 }}
                mode={selectMode}
                placeholder={selectPlaceholder}
                onChange={selectedOnChange}
                labelInValue={true}
                size="large"
                loading={loading}
              >
                {newsletterList}
              </Select>,
            )}
          </FormItem>
        </Form>
      )
    }
  },
)

/* --------------------------------------------------------------- */

// MAIN CODE

@connect(({ campaign }) => ({ campaign }))
@connect(({ newsletter }) => ({ newsletter }))
@Form.create({ name: 'Scheduling_form' })
class CampaignCreatePage extends React.Component {
  state = {
    history: this.props.history,
    current: 0,
    isSaved: false,
    visible: false,
    editCampaignNameVisibility: false,
    StepData: {
      campaignName: localStorage.getItem('campaignName'),
      id: '',
      newSubscription: {
        key: 'null',
        label: 'null',
        triggerTypeId: '70730fd9-16e6-4db7-a8f3-bb69e6b0d479',
      },
      paidOrder: {
        key: 'null',
        label: 'null',
        triggerTypeId: '538b13e6-945e-468e-a0c1-f4463ae339e0',
      },
      abandonedCheckout: {
        key: 'null',
        label: 'null',
        triggerTypeId: 'cc0184f6-f0a3-4b95-9dc3-9dce9ccf5b9d',
      },
      cancelledOrder: {
        key: 'null',
        label: 'null',
        triggerTypeId: '81365fec-0297-4f30-94b7-56fdfd454e38',
      },
      adNewsletter: null,
    },
  }

  componentDidMount = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'campaign/GET_AUTOMATED_CAMPAIGN',
    })
    dispatch({
      type: 'newsletter/GET_NEWSLETTERS',
    })
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

  saveCampaign = e => {
    // message.success('Created campaign successfully')
    const { dispatch, campaign } = this.props
    e.preventDefault()
    // eslint-disable-next-line
    this.props.form.validateFieldsAndScroll((err, values) => {
      // eslint-disable-next-line
      if (!err) {
        // this.state.StepData.campaignName = localStorage.getItem('campaignName')
        this.state.StepData.id = campaign.id
        dispatch({
          type: 'campaign/CREATE_AUTOMATED_CAMPAIGNS',
          payload: this.state.StepData,
        })
      }
    })

    // const newSubscriptionForm = this.saveNewSubscriptionSelectNewsletterFormRef.props.form
  }

  showConfirm = () => {
    const { dispatch, campaign } = this.props
    const { StepData } = this.state
    let status = { id: '', name: '', campaignId: '' }
    if (campaign.status_id === 'c0316ed0-5fb4-491c-a581-62a251b1be8d') {
      status.id = '4cece002-1ae6-4bad-9633-ab30dc55b4e5'
      status.name = 'start'
    }
    if (campaign.status_id === '4cece002-1ae6-4bad-9633-ab30dc55b4e5') {
      status.id = 'c0316ed0-5fb4-491c-a581-62a251b1be8d'
      status.name = 'stop'
    }
    status.campaignId = campaign.id
    Modal.confirm({
      title: `Do you want to ${status.name} right now?`,
      //  eslint-disable-next-line
      content: `All trigger will working until stop it!`,
      onOk() {
        dispatch({
          type: 'campaign/START_STOP_AUTOMATION',
          payload: status,
        })
        dispatch({
          type: 'campaign/GET_AUTOMATED_CAMPAIGN',
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
    value.triggerTypeId = '70730fd9-16e6-4db7-a8f3-bb69e6b0d479'
    console.log('New Subscription Selected', value)
    console.log('New Subscription Selected', this.state.StepData)
    this.state.StepData.newSubscription = value
  }

  // PAID ORDER
  savePaidOrderSelectNewsletterFormRef = formRef => {
    this.savePaidOrderSelectNewsletterFormRef = formRef
  }
  paidOrderSelectedOnChange = value => {
    value.triggerTypeId = '538b13e6-945e-468e-a0c1-f4463ae339e0'
    console.log('Paid Order Selected', value)
    this.state.StepData.paidOrder = value
  }

  // ABANDONED CHECKOUT
  saveAbandonedCheckoutSelectNewsletterFormRef = formRef => {
    this.saveAbandonedCheckoutSelectNewsletterFormRef = formRef
  }

  abandonedCheckoutSelectedOnChange = value => {
    value.triggerTypeId = 'cc0184f6-f0a3-4b95-9dc3-9dce9ccf5b9d'
    console.log('Abandoned Checkout Selected', value)
    this.state.StepData.abandonedCheckout = value
  }

  // CANCELLED ORDER
  saveCancelledOrderSelectNewsletterFormRef = formRef => {
    this.saveCancelledOrderSelectNewsletterFormRef = formRef
  }

  cancelledOrderSelectedOnChange = value => {
    console.log('Cancelled Order Selected', value)
    value.triggerTypeId = '81365fec-0297-4f30-94b7-56fdfd454e38'
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
    this.setState({ editCampaignNameVisibility: false })
  }

  editFormOnSave = () => {
    const { form } = this.editNameFormRef.props
    // const { dispatch } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Campaign name: ', values)
        const { dispatch } = this.props
        dispatch({
          type: 'campaign/EDIT_CAMPAIGN_NAME',
          payload: values,
        })

        // localStorage.setItem('currentNewsletter', JSON.stringify(newsletter))

        // form.resetFields()
        this.setState({ editCampaignNameVisibility: false })
      }
    })
  }

  // PAGE BODY HANDLING FUNCTIONS -- END

  /* --------------------------------------------------------------- */

  // MAIN RENDERING
  render() {
    console.log('CAMPAIGN EDIT PAGE render props', this.props)
    const { current } = this.state
    const { StepData } = this.state
    // const { getFieldDecorator } = this.props.form
    const { newsletter, campaign } = this.props
    const { newsletterList } = newsletter
    const { CampaignTriggers } = campaign
    // const { visible } = this.state

    // let newsletterChildren = () => {
    // if(newsletterList){newsletterList.map(item => {
    //     return <Option value={item.id}>{item.name}</Option>
    //   })}
    // }

    const newsletterChildren = []

    newsletterChildren.push(
      <Option key={'None'} value={'null'}>
        None
      </Option>,
    )
    if (newsletterList) {
      // newsletterChildren.push()
      newsletterList.forEach(item => {
        newsletterChildren.push(
          <Option key={item.id} value={item.email_id}>
            {item.name}
          </Option>,
        )
      })
    }

    var newSubscripingTriggerEmailInitial = []
    var abandonedCheckoutTriggerEmailInitial = []
    var cancelledOrderTriggerEmailInitial = []
    var paidOrderTriggerEmailInitial = []

    if (CampaignTriggers) {
      CampaignTriggers.map(item => {
        if (item.type_id === '70730fd9-16e6-4db7-a8f3-bb69e6b0d479') {
          StepData.newSubscription.key = item.email_id
          newSubscripingTriggerEmailInitial.push(
            <Option
              key={!item.Email.Campaigns[0].email_id ? null : item.Email.Campaigns[0].email_id}
              value={item.Email.Campaigns[0].name}
            >
              {item.Email.Campaigns[0].name}
            </Option>,
          )
        }
        if (item.type_id === '538b13e6-945e-468e-a0c1-f4463ae339e0') {
          StepData.paidOrder.key = item.email_id
          paidOrderTriggerEmailInitial.push(
            <Option key={item.Email.Campaigns[0].email_id} value={item.Email.Campaigns[0].name}>
              {item.Email.Campaigns[0].name}
            </Option>,
          )
        }
        if (item.type_id === '81365fec-0297-4f30-94b7-56fdfd454e38') {
          StepData.cancelledOrder.key = item.email_id
          cancelledOrderTriggerEmailInitial.push(
            <Option key={item.Email.Campaigns[0].email_id} value={item.Email.Campaigns[0].name}>
              {item.Email.Campaigns[0].name}
            </Option>,
          )
        }
        if (item.type_id === 'cc0184f6-f0a3-4b95-9dc3-9dce9ccf5b9d') {
          StepData.abandonedCheckout.key = item.email_id
          abandonedCheckoutTriggerEmailInitial.push(
            <Option key={item.Email.Campaigns[0].email_id} value={item.Email.Campaigns[0].name}>
              {item.Email.Campaigns[0].name}
            </Option>,
          )
        }
      })
    }
    if (campaign.name) {
      return (
        <section className="card">
          <Helmet title="Create Campaign" />

          {/* PAGE HEADER */}

          <Row
            type="flex"
            justify="center"
            style={{ paddingTop: 15, paddingLeft: 10, paddingRight: 10 }}
          >
            <Col span={24}>
              <PageHeader
                //   style={{ backgroundColor: 'black' }}
                title={<h2 className="font-weight-bold">Automated campaign</h2>}
                extra={[
                  <Button key="btnLink" type="link" onClick={this.handlingFinishLater}>
                    Back
                  </Button>,

                  <Button key="btnSave" type="primary" onClick={this.saveCampaign}>
                    Save
                  </Button>,

                  <Button
                    key="btnStart"
                    type={
                      campaign.status_id === '4cece002-1ae6-4bad-9633-ab30dc55b4e5'
                        ? 'danger'
                        : 'primary'
                    }
                    onClick={this.showConfirm}
                  >
                    {campaign.status_id === '4cece002-1ae6-4bad-9633-ab30dc55b4e5'
                      ? 'Stop'
                      : 'Start'}
                  </Button>,
                ]}
                tags={
                  <span>
                    {['Available']
                      ? null
                      : ['Available'].map(tag => {
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
                  {newsletter ? null : (
                    <Descriptions.Item label="Last modified">
                      {/* <Moment format="MM/DD/YYYY HH:mm:ss">
                      {!newsletter ? null : newsletter.lastModified}
                    </Moment> */}
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
              <Steps current={current} onChange={this.onStepChange} direction="vertical">
                <Step
                  key="newSubscriber"
                  status={!StepData.newSubscription ? 'wait' : 'finish'}
                  title={<h4>New Subscription</h4>}
                  description={
                    <Fragment>
                      <p>
                        Select this option, if any new success subscription is received for this
                        campaign, the subscriber will be received a welcome newsletter
                      </p>
                      <Divider type="horizontal" />

                      <Row type="flex" justify="center">
                        <Col span={18}>
                          <SelectNewsletterForm
                            wrappedComponentRef={this.saveNewSubscriptionSelectNewsletterFormRef}
                            formLabel="Select Newsletter"
                            fieldName="NewSubscriptionNewsletterSelect"
                            isFieldRequired={true}
                            selectMode="default"
                            fieldRequiredMsg="Please a newsletter"
                            initialFieldValue={newSubscripingTriggerEmailInitial}
                            selectPlaceholder="Choose a welcome newsletter"
                            selectedOnChange={this.newSubscriptionSelectedOnChange}
                            newsletterList={newsletterChildren}
                            loading={false}
                          />
                        </Col>
                      </Row>
                      <Divider type="horizontal" />
                    </Fragment>
                  }
                />
                <Step
                  key="paidOrder"
                  status={!StepData.paidOrder ? 'wait' : 'finish'}
                  title={<h4>Paid Order</h4>}
                  description={
                    <Fragment>
                      <p>
                        Select this option, if any paid order in this campaign is made by a
                        subscriber, the subscriber will be received a summary of the order
                        newsletter
                      </p>

                      <Divider type="horizontal" />
                      <Row type="flex" justify="center">
                        <Col span={18}>
                          <SelectNewsletterForm
                            wrappedComponentRef={this.savePaidOrderSelectNewsletterFormRef}
                            formLabel="Select Newsletter"
                            fieldName="PaidOrderNewsletterSelect"
                            isFieldRequired={true}
                            selectMode="default"
                            fieldRequiredMsg="Please a newsletter"
                            initialFieldValue={paidOrderTriggerEmailInitial}
                            selectPlaceholder="Choose a paid order newsletter"
                            selectedOnChange={this.paidOrderSelectedOnChange}
                            newsletterList={newsletterChildren}
                            loading={false}
                          />
                        </Col>
                      </Row>

                      <Divider type="horizontal" />
                    </Fragment>
                  }
                />
                <Step
                  key="abandonedCheckout"
                  status={!StepData.abandonedCheckout ? 'wait' : 'finish'}
                  title={<h4>Abandoned Checkout</h4>}
                  description={
                    <Fragment>
                      <p>
                        Select this option, any order which has been left for a while without
                        completing a payment in this campaign, the subscriber will be received a
                        reminder newsletter
                      </p>

                      <Divider type="horizontal" />

                      <Row type="flex" justify="center">
                        <Col span={18}>
                          <SelectNewsletterForm
                            wrappedComponentRef={this.saveAbandonedCheckoutSelectNewsletterFormRef}
                            formLabel="Select Newsletter"
                            fieldName="AbandonedCheckoutNewsletterSelect"
                            isFieldRequired={true}
                            selectMode="default"
                            fieldRequiredMsg="Please a newsletter"
                            initialFieldValue={abandonedCheckoutTriggerEmailInitial}
                            selectPlaceholder="Choose an abandoned checkout newsletter"
                            selectedOnChange={this.abandonedCheckoutSelectedOnChange}
                            newsletterList={newsletterChildren}
                            loading={false}
                          />
                        </Col>
                      </Row>

                      <Divider type="horizontal" />
                    </Fragment>
                  }
                />
                <Step
                  key="cancelledOrder"
                  status={!StepData.cancelledOrder ? 'wait' : 'finish'}
                  title={<h4>Cancelled Order</h4>}
                  description={
                    <Fragment>
                      <p>
                        Select this option, any order has been cancelled in this campaign, the
                        subscriber will be received a notification newsletter
                      </p>

                      <Divider type="horizontal" />

                      <Row type="flex" justify="center">
                        <Col span={18}>
                          <SelectNewsletterForm
                            wrappedComponentRef={this.saveCancelledOrderSelectNewsletterFormRef}
                            formLabel="Select Newsletter"
                            fieldName="CancelledOrderNewsletterSelect"
                            isFieldRequired={true}
                            selectMode="default"
                            fieldRequiredMsg="Please a newsletter"
                            initialFieldValue={cancelledOrderTriggerEmailInitial}
                            selectPlaceholder="Choose a cancelled order newsletter"
                            selectedOnChange={this.cancelledOrderSelectedOnChange}
                            newsletterList={newsletterChildren}
                            loading={false}
                          />
                        </Col>
                      </Row>

                      <Divider type="horizontal" />
                    </Fragment>
                  }
                />

                <Step status="error" style={{ display: 'none' }} />
              </Steps>

              {/* <Divider type="horizontal" /> */}
            </Col>
          </Row>

          {/* PAGE BODY -- END */}
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
                spinning={!campaign.name ? true : false}
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

export default CampaignCreatePage
