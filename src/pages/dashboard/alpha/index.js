/* eslint-disable */
import React from 'react'
import { connect } from 'react-redux'
import { Button, Table, Row, Col, Divider } from 'antd'
import { Helmet } from 'react-helmet'
import PaymentCard from 'components/CleanUIComponents/PaymentCard'
import PaymentAccount from 'components/CleanUIComponents/PaymentAccount'
import PaymentTransaction from 'components/CleanUIComponents/PaymentTransaction'
import ChartCard from 'components/CleanUIComponents/ChartCard'
import Authorize from 'components/LayoutComponents/Authorize'
import { tableData } from './data.json'
import Moment from 'react-moment'
import { Doughnut } from 'react-chartjs-2'

@connect(({ statistics }) => ({ statistics }))
class DashboardAlpha extends React.Component {
  state = {
    loading: !this.props.statistics.pageLoading ? false : this.props.statistics.pageLoading,
    history: this.props.history,
    dispatch: this.props.dispatch,
    location: this.props.location,
    // statistics: this.props.statistics.statistics,
  }

  componentDidMount = () => {
    setInterval(() => {
      this.setState({
        curTime: new Date().toLocaleString(),
      })
    }, 1000)
    console.log('DASHBOARD componentDidMount PROPS', this.props)

    this.state.dispatch({
      type: 'statistics/GET_STATISTICS',
    })
  }

  componentWillReceiveProps(nextProps) {
    console.log('DASHBOARD componentWillReceiveProps PROPS', nextProps)
    // this.setState({ nextProps })
  }

  render() {
    const { loading } = this.state
    const clock = this.state.curTime
    const storeName = 'EMM Demo Store'
    const { statistics } = this.props.statistics

    const doughnutGlobalOptions = { tooltips: { enabled: false } }

    // Store customer data
    let totalSubscribers = statistics.totalSubscriber
    let totalCustomers = statistics.totalCustomer

    // Sent statistics data
    let totalSent = statistics.isSent
    let totalBounced = statistics.isBounced
    let totalNotSent = statistics.notSendYet

    // console.log('statisticsData', statistics)
    const sentData = {
      labels: [`Sent: ${totalSent}`, `Bounced: ${totalBounced}`],
      datasets: [
        {
          data: [totalSent, totalBounced],
          backgroundColor: ['#00C07F', '#FF6562'],
          hoverBackgroundColor: ['rgb(0,192,127,.8)', 'rgb(255,101,98, .8)'],
        },
      ],
    }

    // Opened statistics data
    let totalOpened = statistics.isOpened
    let totalNotOpened = statistics.isNotOpened
    const openedData = {
      labels: [`Opened: ${totalOpened}`, `Not Opened: ${totalNotOpened}`],
      datasets: [
        {
          data: [totalOpened, totalNotOpened],
          backgroundColor: ['#00C07F', '#FF6562'],
          hoverBackgroundColor: ['rgb(0,192,127,.8)', 'rgb(255,101,98, .8)'],
        },
      ],
    }

    // Clicked statistics data
    let totalClicked = statistics.isClicked
    let totalNotClicked = statistics.isNotClicked
    const clickedData = {
      labels: [`Clicked: ${totalClicked}`, `Not Clicked: ${totalNotClicked}`],
      datasets: [
        {
          data: [totalClicked, totalNotClicked],
          backgroundColor: ['#00C07F', '#FF6562'],
          hoverBackgroundColor: ['rgb(0,192,127,.8)', 'rgb(255,101,98, .8)'],
        },
      ],
    }

    // Email statistics calculation
    let bouncedRate = (totalBounced / (totalBounced + totalSent)).toFixed(2) * 100
    let openedRate = (totalOpened / (totalNotOpened + totalOpened)).toFixed(2) * 100
    let clickedRate = (totalClicked / (totalNotClicked + totalClicked)).toFixed(2) * 100

    // Customer data
    const customerData = {
      labels: [`Customer: ${totalCustomers}`, `Subscriber: ${totalSubscribers}`],
      datasets: [
        {
          data: [totalCustomers, totalSubscribers],
          backgroundColor: ['#6d78ad', '#e7823a'],
          hoverBackgroundColor: ['rgb(109,120,173,.8)', 'rgb(231,130,58,.8)'],
        },
      ],
    }

    return (
      <Authorize roles={['StoreOwner']} redirect to="/admin">
        <Helmet title="Dashboard" />

        {loading === true ? (
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
        ) : (
          undefined
        )}

        {/* WRAPPER */}
        {loading === false ? (
          <Row type="flex" justify="center" className="card">
            <Col span={24}>
              {/* HEADER */}
              <Row type="flex" justify="start" className="card-body">
                <Col span={21}>
                  <h2>Welcome, {storeName}</h2>
                  <h5
                    style={{
                      // marginLeft: 20,
                      // color: '#192523',
                      // color: '#082159',
                      // color: '#193943',
                      color: '#172721',
                    }}
                  >
                    <Moment format={`dddd, MMMM Do, YYYY | HH:mm:ss`}>{clock}</Moment>
                  </h5>
                </Col>
                <Col span={3}></Col>
              </Row>

              <Divider type="horizontal" />

              {/* Total Subscribers*/}
              <Row type="flex" justify="start" className="card-body">
                <Col
                  span={7}
                  style={{
                    position: 'relative',
                    // backgroundColor: 'yellow',
                  }}
                >
                  <h3
                    style={{
                      // backgroundColor: 'blue',
                      textAlign: 'right',
                      position: 'absolute',
                      top: '50%',
                      transform: 'translate(0%,-0%)',
                      right: 0,
                      marginRight: -100,
                    }}
                  >
                    {'Store Customers'.toUpperCase()}
                  </h3>
                </Col>
                <Col span={17} className="card-body">
                  <Doughnut data={customerData} options={doughnutGlobalOptions} />
                </Col>
                {/* <Col span={2}></Col> */}
              </Row>

              <Row type="flex" justify="center">
                <Col span={18}>
                  <h3 style={{ textAlign: 'center' }}>{'Email Statistics'.toUpperCase()}</h3>
                </Col>
              </Row>
              {/* Bounced, Clicked URL, Opened Rate */}
              <Row type="flex" justify="start" className="card-body">
                <Col span={8}>
                  <Doughnut data={sentData} options={doughnutGlobalOptions} />
                  <h4 style={{ marginTop: 10, textAlign: 'center' }}>
                    {`Bounced Rate ${bouncedRate}%`}
                  </h4>
                </Col>
                <Col span={8}>
                  <Doughnut data={openedData} options={doughnutGlobalOptions} />
                  <h4 style={{ marginTop: 10, textAlign: 'center' }}>
                    {`Opened Rate ${openedRate}%`}
                  </h4>
                </Col>
                <Col span={8}>
                  <Doughnut data={clickedData} options={doughnutGlobalOptions} />
                  <h4 style={{ marginTop: 10, textAlign: 'center' }}>
                    {`Clicked Rate ${clickedRate}%`}
                  </h4>
                </Col>
              </Row>
            </Col>
          </Row>
        ) : (
          undefined
        )}
      </Authorize>
    )
  }
}

export default DashboardAlpha
