/* eslint-disable */
import React from 'react'
import { Form, Table, Button, Tag, Modal, Row, PageHeader, Descriptions, Col, Spin } from 'antd'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

const { confirm } = Modal

@connect(({ audience }) => ({ audience }))
// @connect(({ visitor }) => ({ visitor }))
// @connect(({ tag }) => ({ tag }))
@Form.create()
class AudienceDetailPage extends React.Component {
  constructor(props) {
    super(props)
    this.props = props
    this.handleDelete = this.handleDelete.bind(this)
    this.start = this.start.bind(this)
  }

  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    confirmDirty: false,
  }

  componentDidMount = () => {
    const { dispatch } = this.props
    const audienceId = localStorage.getItem('audienceId')
    dispatch({
      type: 'audience/GET_AUDIENCE_SUBSCRIBERS',
      payload: { audienceId },
    })
  }

  componentWillReceiveProps(nextProps) {
    // const { dispatch } = this.props
    console.log('componentWillReceiveProps', nextProps)
    this.setState(nextProps)
  }

  //  modal
  handleSubmit = e => {
    const { dispatch } = this.props
    e.preventDefault()
    // eslint-disable-next-line
    this.props.form.validateFieldsAndScroll((err, values) => {
      // eslint-disable-next-line
      if (!err) {
        console.log('Received values of form: ', values)
        dispatch({
          type: 'subscriber/CREATE_A_SUBSCRIBER',
          payload: values,
        })
      }
    })
  }

  // eslint-disable-next-line
  handleConfirmBlur = e => {
    const { value } = e.target
    // eslint-disable-next-line
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  //   componentDidMount = () => {
  //     const { dispatch } = this.props
  //     dispatch({ type: 'subscriber/GET_DATA_SUBSCRIBERS' })
  //     dispatch({ type: 'tag/GET_DATA_TAGS' })
  //     dispatch({ type: 'subscriber/LOAD_SUBSCRIBER_TYPES' })

  start = () => {
    const { dispatch } = this.props
    const audienceId = localStorage.getItem('audienceId')
    dispatch({
      type: 'audience/GET_AUDIENCE_SUBSCRIBERS',
      payload: { audienceId },
    })
    this.setState({ loading: true })
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      })
    }, 500)
  }

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    this.setState({ selectedRowKeys })
  }

  handleDelete = () => {
    const { dispatch } = this.props
    const { selectedRowKeys } = this.state
    const audienceId = localStorage.getItem('audienceId')
    confirm({
      title: `Do you want to remove subscriber out of the audience?`,
      //  eslint-disable-next-line
      content: `Subscribers will remove after click OK `,
      onOk: () => {
        console.log(`OK ${selectedRowKeys}`)

        dispatch({
          type: 'audience/REMOVE_SUBSCRIBER_OUT_OF_AUDIENCE',
          payload: {
            selectedRowKeys,
            audienceId,
          },
        })
        this.setState({ selectedRowKeys: [] })
        dispatch({
          type: 'audience/GET_AUDIENCE_SUBSCRIBERS',
          payload: { audienceId },
        })
        this.start()
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  routeBack = () => {
    const path = `../audiences`
    //  eslint-disable-next-line
    this.props.history.push(path)
  }

  render() {
    // eslint-disable-next-line
    const { audience } = this.props
    // const { AudienceDetail } = audience
    // const { visitor } = audience.AudienceDetail
    const AudienceDetail = JSON.parse(localStorage.getItem('audienceDetail'))
    const auDetail = AudienceDetail
    let subscriber = []
    if (auDetail !== null) {
      //  eslint-disable-next-line
      subscriber = auDetail.subscribers
    }
    const { loading, selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    const hasSelected = selectedRowKeys.length > 0
    // const hasSelectedTag = selectedItems.length > 0
    const columns = [
      {
        title: 'Email',
        width: 200,
        dataIndex: 'email',
        key: '1',
        render: email => <Link to="/subscriber/subscribers/detail">{email}</Link>,
      },
      {
        title: 'First name',
        dataIndex: 'first_name',
        key: '6',
        width: 220,
      },
      {
        title: 'Last name',
        dataIndex: 'last_name',
        key: '7',
        width: 220,
      },
      {
        title: 'Type',
        dataIndex: 'type_id',
        key: '9',
        width: 200,
        // eslint-disable-next-line
        render: type_id => (
          <div>
            <Tag
              color={
                // eslint-disable-next-line
                (type_id === 'af49580e-5d02-4390-9958-ee00d0f1f6ee' ? 'green' : '') ||
                // eslint-disable-next-line
                (type_id === '1a9df890-f885-11e9-8a22-8d9b4ee59e9d' ? 'red' : '') ||
                // eslint-disable-next-line
                (type_id === 'fb12ceae-c62a-4e99-aeae-ce2fbe83535c' ? 'blue' : '')
              }
            >
              {// eslint-disable-next-line
              type_id === 'fb12ceae-c62a-4e99-aeae-ce2fbe83535c'
                ? 'Customer'
                : // eslint-disable-next-line
                '' || type_id === 'af49580e-5d02-4390-9958-ee00d0f1f6ee'
                ? 'Subscriber'
                : // eslint-disable-next-line
                '' || type_id === '1a9df890-f885-11e9-8a22-8d9b4ee59e9d'
                ? 'Visitor'
                : ''}
            </Tag>
          </div>
        ),
      },
      {
        title: 'Lastest changed',
        // eslint-disable-next-line
        dataIndex: 'last_modified_date',
        key: '5',
        width: 200,
        // eslint-disable-next-line
        render: last_modified_date => (
          // eslint-disable-next-line
          <Moment format="MM/DD/YYYY HH:mm">{last_modified_date}</Moment>
        ),
      },
    ]
    if (AudienceDetail) {
      // eslint-disable-next-line
      return (
        <section className="card">
          <Row type="flex" justify="center" className="card-body">
            <Col span={22}>
              <div>
                <PageHeader
                  ghost={false}
                  onBack={() => this.routeBack()}
                  title={!AudienceDetail.name ? '' : AudienceDetail.name}
                  subTitle="This is a subtitle"
                  style={{ marginLeft: '-20px' }}
                >
                  <Descriptions size="small" column={1}>
                    <Descriptions.Item label="Creation Time">
                      {<Moment format="MM/DD/YYYY HH:mm">{AudienceDetail.lastModifiedDate}</Moment>}
                    </Descriptions.Item>
                  </Descriptions>
                </PageHeader>
                <Row style={{ marginBottom: 16 }}>
                  <Button type="primary" onClick={this.start} loading={loading}>
                    <Link to="/subscriber/audiences/detail"> Reload</Link>
                  </Button>
                  <Button
                    type="danger"
                    onClick={this.handleDelete}
                    disabled={!hasSelected}
                    style={{ marginLeft: '5px' }}
                  >
                    Remove
                  </Button>
                </Row>
                <Table
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={subscriber}
                  rowKey={record => record.id}
                />
              </div>
            </Col>
          </Row>
        </section>
      )
    }
    return (
      <section className="card">
        <Helmet title="Audience Detail" />
        <Row type="flex" justify="center">
          <Col span={12}>
            <Spin
              style={{
                // backgroundColor: 'yellow',
                width: '100%',
              }}
              spinning={!AudienceDetail ? true : false}
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

// ReactDOM.render(
//   <Table columns={columns} dataSource={data} scroll={{ x: 1500, y: 300 }} />
// );
export default AudienceDetailPage
