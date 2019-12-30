/* eslint-disable */
import React from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import {
  Layout,
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
  message,
  Descriptions,
  Steps,
  Icon,
  Select,
  Spin,
  Empty,
} from 'antd'
import Moment from 'react-moment'

const { Step } = Steps
const FormItem = Form.Item
const { Option } = Select
const { Search } = Input
const { confirm } = Modal

/* --------------------------------------------------------------- */

// MAIN CODE
@connect(({ subscriber }) => ({ subscriber }))
class UnsubscribePage extends React.Component {
  state = {
    history: this.props.history,
    dispatch: this.props.dispatch,
    location: this.props.location,
    pageLoading: false,
    audienceId: [],
    subscriberId: [],
    campaignId: [],
  }

  componentDidMount = () => {
    console.log('SUBSCRIBER_UNSUBSCRIBE componentDidMount PROPS', this.props)
    const locationSearch = this.state.location.search
    let urlParams = new String(locationSearch)
    urlParams = urlParams.slice(1, urlParams.length)
    let params = urlParams.split('&')
    this.state.subscriberId = params[0].split('=')
    this.state.audienceId = params[1].split('=')
    this.state.campaignId = params[2].split('=')

    console.log('UNSUBSCRIBE state.subscriberId', this.state.subscriberId)
    console.log('UNSUBSCRIBE state.audienceId', this.state.audienceId)
    console.log('UNSUBSCRIBE state.campaignId', this.state.campaignId)

    // dispatch: get subscriber name, get store name
  }

  componentWillReceiveProps(nextProps) {
    console.log('NEWSLETTER_HOME_PAGE componentWillReceiveProps PROPS', nextProps)
    // this.setState({ nextProps })
  }

  /* --------------------------------------------------------------- */

  // PAGE HEADER HANDLING FUNCTIONS
  // PAGE HEADER HANDLING FUNCTIONS -- END

  /* --------------------------------------------------------------- */

  // PAGE BODY HANDLING FUNCTIONS
  confirmYes = () => {
    this.state.dispatch({
      type: 'subscriber/UNSUBSCRIBE',
      payload: {
        subscriber: {
          id: this.state.subscriberId[1],
          audienceId: this.state.audienceId[1],
          campaignId: this.state.campaignId[1],
        },
      },
    })
    setTimeout(() => {
      window.close()
    }, 7000)
  }

  confirmNo = () => {
    setTimeout(() => {
      window.close()
    }, 1000)
  }

  // PAGE BODY HANDLING FUNCTIONS -- END

  /* --------------------------------------------------------------- */

  // MAIN RENDERING
  render() {
    console.log('UNSUBSCRIBE PAGE render', this.props)

    return (
      <Layout>
        <Helmet title="Unsubscribe Me" />

        <Layout.Sider></Layout.Sider>
        <Layout.Content>
          <section className="card" style={{ margin: 25 }}>
            <div className="card-body">
              {/* PAGE HEADER */}

              <Row type="flex" justify="center" style={{}}>
                <Col span={22} style={{}}>
                  <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    Unsubscribed Confirmation
                  </h2>
                </Col>
              </Row>

              {/* PAGE HEADER - END */}

              <Divider type="horizontal" />

              {/* PAGE BODY */}

              <Row
                type="flex"
                justify="center"
                style={{
                  marginTop: 20,
                  width: '100%',
                  // backgroundColor: 'black',
                }}
              >
                <Col
                  span={22}
                  style={
                    {
                      // backgroundColor: 'yellow',
                    }
                  }
                >
                  <Row type="flex" justify="center">
                    <Col span={17}>
                      <p>
                        If you unsubscribe from us, you will miss some of our promotions, special
                        offers, and gifts from our store. Do you still want to continue?
                      </p>
                    </Col>
                  </Row>
                  <Row type="flex" justify="center">
                    <Col span={15} style={{ alignItems: 'center' }}>
                      <Row type="flex" justify="center">
                        <Button
                          type="primary"
                          onClick={this.confirmYes}
                          style={{ marginRight: 20 }}
                        >
                          Yes
                        </Button>
                        <Button type="danger" onClick={this.confirmNo}>
                          No
                        </Button>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* PAGE BODY - END */}
            </div>
          </section>
        </Layout.Content>
        <Layout.Sider></Layout.Sider>
      </Layout>
    )
  }
}

export default UnsubscribePage
