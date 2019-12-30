import React from 'react'
import { Helmet } from 'react-helmet'
import { Row, Col, Button, Table, Tag, Form, Tabs, Divider, Input } from 'antd'
import Moment from 'react-moment'

import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const { TabPane } = Tabs
const { Search } = Input

@connect(({ adminAccount }) => ({ adminAccount }))
@Form.create()
class AdminAccountHome extends React.Component {
  constructor(props) {
    super(props)
    this.props = props
  }

  state = {
    selectedRowKeys: [],
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    e.preventDefault()
    // eslint-disable-next-line
    this.props.form.validateFieldsAndScroll((err, values) => {
      // eslint-disable-next-line
      if (!err) {
        console.log('Received values of form: ', values)
        dispatch({
          type: 'adminAccount/INSERT_A_ACCOUNT',
          payload: values,
        })
      }
    })
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys })
  }

  deselectAll = () => {
    this.setState({ selectedRowKeys: [] })
  }

  componentDidMount = () => {
    const { dispatch } = this.props
    dispatch({ type: 'adminAccount/GET_DATA_ACCOUNTS' })
  }

  // handleClick = e => {
  //   console.log('click ', e)
  //   this.setState({
  //     current: e.key,
  //   })
  // }

  render() {
    // eslint-disable-next-line
    const { getFieldDecorator } = this.props.form
    const { adminAccount } = this.props
    const { accounts } = adminAccount
    // , roles

    const { selectedRowKeys } = this.state
    // const { current } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    const hasSelected = selectedRowKeys.length > 0
    const columns = [
      {
        title: 'account Name',
        dataIndex: 'email',
        key: 1,
        width: '20%',
        // ...this.getColumnSearchProps('audience'),
        render: email => <Link to="/apps/profile">{email}</Link>,
      },
      {
        title: 'edited date',
        dataIndex: 'last_modified_date',
        key: 2,
        width: '20%',
        render: lastModifiedDate => (
          <Moment format="MM/DD/YYYY HH:mm:ss">{lastModifiedDate}</Moment>
        ),
        // ...this.getColumnSearchProps('audience'),
      },
      {
        title: 'store Name',
        dataIndex: 'store_name',
        key: 3,
        width: '20%',
        // ...this.getColumnSearchProps('audience'),
        render: storenname => <div>{storenname === '' ? 'Not Have Yet' : storenname}</div>,
      },

      {
        title: 'store domain',
        dataIndex: 'store_domain',
        key: 4,
        width: '20%',
        // ...this.getColumnSearchProps('audience'),

        render: domain => <div>{domain === '' ? 'Not Have Yet' : domain}</div>,
      },

      {
        title: 'Status ',
        dataIndex: 'activation',
        key: 5,
        width: '20%',
        render: activation => (
          <div>
            <Tag
              color={
                (activation === 'Activated' ? 'green' : '') ||
                (activation === 'Deactivated' ? 'red' : '')
              }
            >
              {activation}
            </Tag>
          </div>
        ),
        // ...this.getColumnSearchProps('audience'),
      },
    ]
    // const menu = (
    //   <Menu>
    //     <Menu.Item key="Activated">
    //       <Icon type="aliwangwang" />
    //       Activated
    //     </Menu.Item>
    //     <Menu.Item key="Deactivated">
    //       <Icon type="aliwangwang" />
    //       Deactivated
    //     </Menu.Item>
    //   </Menu>
    // )

    // var { filtername, filterstatus } = this.props
    return (
      <section className="card">
        <div className="card-body">
          <Helmet title="Campaigns" />
          <Row type="flex" justify="start">
            <Col span={21}>
              <h1>System Adminstartor</h1>
              <h3>You can manage all Store Owners account here.</h3>
            </Col>
          </Row>
          <br />
          <br />
          <Row type="flex" justify="start" gutter={20}>
            <Col span={24}>
              <Tabs defaultActiveKey="1">
                <TabPane tab={<h5>Store Owner Management</h5>} key="1">
                  <div>
                    <Row type="flex" justify="start">
                      <Col span={10}>
                        <Divider type="vertical" />
                        <Button type="danger" disabled={!hasSelected} style={{ marginLeft: 10 }}>
                          Change Status
                        </Button>
                        {/* <Dropdown.Button overlay={menu} icon={<Icon type="aliwangwang" />}>
                          Status
                        </Dropdown.Button> */}
                        <Divider type="vertical" />
                        <span style={{ marginLeft: 8 }}>
                          {hasSelected ? `${selectedRowKeys.length} selected` : ''}
                        </span>
                      </Col>
                      <Col span={10} offset={4}>
                        <Search
                          placeholder="Find store owner by store name or domain"
                          onSearch={value => console.log(value)}
                          style={{ width: 300, float: 'right' }}
                        />
                      </Col>
                    </Row>
                    <Divider />
                    <Table
                      columns={columns}
                      rowSelection={rowSelection}
                      dataSource={accounts}
                      rowKey={record => record.id}
                    />
                  </div>
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </div>
      </section>
    )
  }
}

export default AdminAccountHome
