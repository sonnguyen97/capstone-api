/* eslint-disable */
import React from 'react'
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
} from 'antd'
import Moment from 'react-moment'

const { Step } = Steps
const FormItem = Form.Item
const { Option } = Select
const { Search } = Input
const { confirm } = Modal

/* --------------------------------------------------------------- */

/* --------------------------------------------------------------- */

// MAIN CODE
class EmailflowHome extends React.Component {
  state = {
    visible: false,
    history: this.props.history,
    dispatch: this.props.dispatch,
    nodeCount: 0,
    childrenNodes: [],
  }

  componentDidMount = () => {
    console.log('EMAILFLOW_HOME_PAGE componentDidMount PROPS', this.props)
  }

  componentWillReceiveProps(nextProps) {
    console.log('EMAILFLOW_HOME_PAGE componentWillReceiveProps PROPS', nextProps)
    // this.setState({ nextProps })
  }

  /* --------------------------------------------------------------- */

  // PAGE HEADER HANDLING FUNCTIONS

  // PAGE HEADER HANDLING FUNCTIONS -- END

  /* --------------------------------------------------------------- */

  // PAGE BODY HANDLING FUNCTIONS

  addAction = e => {
    e.preventDefault()
    let nodeIndex = this.state.nodeCount
    let childrenNodes = this.state.childrenNodes

    childrenNodes.push(
      <Row key={nodeIndex} type="flex" justify="center" style={{ marginBottom: 10 }}>
        <Col>
          <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
            <Col>
              <span>Newsletter Name {nodeIndex}</span>
            </Col>
          </Row>
          <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
            <Col>
              <Divider type="vertical" style={{ height: 20 }} />
            </Col>
          </Row>
        </Col>
      </Row>,
    )

    this.state.nodeCount = ++nodeIndex
    this.setState({
      childrenNodes: childrenNodes,
    })
    // this.state.childrenNodes = childrenNodes

    console.log('Children Nodes', this.state.childrenNodes)
  }

  // PAGE BODY HANDLING FUNCTIONS -- END

  /* --------------------------------------------------------------- */

  // MAIN RENDERING
  render() {
    console.log('EMAIL FLOW HOME PAGE render', this.props)

    let childrenActionNodes = !this.state.childrenNodes ? null : this.state.childrenNodes

    return (
      <section className="card">
        <Helmet title="Email Flow" />

        {/* PAGE HEADER */}
        <Row type="flex" justify="center" className="card-body">
          <Col span={23}>
            <h1>Email Flow</h1>
            <h4>You can define your own running flow</h4>
          </Col>
        </Row>
        {/* PAGE HEADER - END */}

        <Divider type="horizontal" />

        <Row type="flex" justify="center" className="card-body" style={{ fontSize: '1.3em' }}>
          <Col span={18}>
            {/* NODE START */}
            <Row type="flex" justify="center">
              <Col>
                <span>START</span>
              </Col>
            </Row>
            <Row type="flex" justify="center" style={{ marginBottom: 10 }}>
              <Col>
                <Divider type="vertical" style={{ height: 20 }} />
              </Col>
            </Row>

            {/* CHILDREN NODES */}
            <Row id="child-node-wrapper" type="flex" justify="center">
              <Col id="children-nodes">{childrenActionNodes}</Col>
            </Row>
            <Row type="flex" justify="center">
              <Col>
                <Button type="primary" shape="circle" icon="plus" onClick={this.addAction} />
              </Col>
            </Row>

            {/* NODE END */}
            <Row type="flex" justify="center" style={{ marginTop: 10 }}>
              <Col>
                <Divider type="vertical" style={{ height: 20 }} />
              </Col>
            </Row>
            <Row type="flex" justify="center">
              <Col>
                <span>END</span>
              </Col>
            </Row>
          </Col>
        </Row>
      </section>
    )
  }
}

export default EmailflowHome
