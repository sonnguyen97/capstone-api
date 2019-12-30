import React from 'react'
import {
  Form,
  Input,
  Table,
  Button,
  Icon,
  Tag,
  Modal,
  Row,
  InputNumber,
  Col,
  notification,
} from 'antd'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { connect } from 'react-redux'
import Highlighter from 'react-highlight-words'

// const { confirm } = Modal

// function handleButtonClick(e) {
//   message.info('Click on right button.')
//   console.log('click right button', e)
// }

@connect(({ subscriber }) => ({ subscriber }))
@connect(({ audience }) => ({ audience }))
@Form.create()
class Subscriber extends React.Component {
  constructor(props) {
    super(props)
    this.props = props
    this.handleDelete = this.handleDelete.bind(this)
    this.start = this.start.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    visible: false,
    confirmDirty: false,
    movingVisible: false,
    searchText: '',
    searchedColumn: '',
    // filteredInfo: null,
    sortedInfo: null,
    obj: {
      id: '',
      email: '',
      last_name: '',
      first_name: '',
      order_count: '',
      cancelled_order: '',
      total_spent: '',
    },
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
      if (values.cancelOrderTimes > values.orderCount) {
        notification.error({
          message: 'Cancelled order cant greater than total order!',
        })
        return
      }
      if (values.cancelOrderTimes === values.orderCount && values.totalSpent > 0) {
        notification.error({
          message:
            'Total spent cant greater than 0 when total orders equals total cancelled orders!',
        })
        return
      }
      // eslint-disable-next-line
      if (!err) {
        console.log('Received values of form: ', values)
        dispatch({
          type: 'subscriber/CREATE_A_SUBSCRIBER',
          payload: values,
        })
        setTimeout(() => {
          this.setState({
            loading: false,
          })
        }, 3000)
      }
      dispatch({ type: 'subscriber/GET_DATA_SUBSCRIBERS' })
    })
  }

  handleUpdate = e => {
    const { dispatch } = this.props
    e.preventDefault()
    // eslint-disable-next-line
    this.props.form.validateFieldsAndScroll((err, values) => {
      // eslint-disable-next-line
      if (!err) {
        console.log('Received values of form: ', values)
        dispatch({
          type: 'subscriber/UPDATE_SUBSCRIBERS',
          payload: values,
        })
        setTimeout(() => {
          this.setState({
            loading: false,
          })
        }, 3000)
      }
      dispatch({ type: 'subscriber/GET_DATA_SUBSCRIBERS' })
    })
  }

  // eslint-disable-next-line
  handleConfirmBlur = e => {
    const { value } = e.target
    // eslint-disable-next-line
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  componentDidMount = () => {
    const { dispatch } = this.props
    dispatch({ type: 'subscriber/GET_DATA_SUBSCRIBERS' })
    // dispatch({ type: 'tag/GET_DATA_TAGS' })
    dispatch({ type: 'subscriber/LOAD_SUBSCRIBER_TYPES' })
    dispatch({ type: 'audience/GET_AUDIENCE' })
  }

  showModal = () => {
    // eslint-disable-next-line
    this.props.form.resetFields()
    this.setState({
      visible: true,
      obj: {
        id: '',
        email: '',
        last_name: '',
        first_name: '',
        order_count: '',
        cancelled_order: '',
        total_spent: '',
      },
    })
  }

  showModalMovingSub = () => {
    this.setState({
      movingVisible: true,
    })
  }

  handleOk = e => {
    console.log(e)
    this.setState({
      visible: false,
    })
  }

  start = () => {
    this.setState({ loading: true })
    const { dispatch } = this.props
    dispatch({
      type: 'subscriber/GET_DATA_SUBSCRIBERS',
    })
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        selectedRowKeysAudience: [],
        loading: false,
      })
    }, 500)
  }

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys)
    this.setState({ selectedRowKeys })
  }

  onSelectChangeAudience = selectedRowKeysAudience => {
    console.log('selectedRowKeysAudience changed: ', selectedRowKeysAudience)
    this.setState({ selectedRowKeysAudience })
  }

  showConfirm = e => {
    const { dispatch } = this.props
    const { selectedRowKeys } = this.state
    const typeId = e.key
    Modal.confirm({
      title: `Do you Want to change type of subscribers to ${typeId}?`,
      //  eslint-disable-next-line
      content: `Subscriber will change the type after click OK `,
      onOk() {
        console.log(`OK ${selectedRowKeys} ${typeId}`)
        dispatch({
          type: 'subscriber/UPDATE_SUBSCRIBERS',
          payload: {
            selectedRowKeys,
            typeId,
          },
        })
        dispatch({
          type: 'subscriber/GET_DATA_SUBSCRIBERS',
        })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  handleDelete = () => {
    const { dispatch } = this.props
    const { selectedRowKeys } = this.state
    Modal.confirm({
      title: `Do you want to delete this subscribers?`,
      //  eslint-disable-next-line
      content: `Subscribers will delete after click OK `,
      onOk: () => {
        console.log(`OK ${selectedRowKeys}`)
        dispatch({
          type: 'subscriber/DELETE_SUBSCRIBERS',
          payload: {
            selectedRowKeys,
          },
        })
        this.setState({ selectedRowKeys: [] })
        dispatch({
          type: 'subscriber/GET_DATA_SUBSCRIBERS',
        })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  routeChange = () => {
    const path = `../subscriber/excel`
    //  eslint-disable-next-line
    this.props.history.push(path)
  }

  handleMoveSubToAudience = () => {
    const { dispatch } = this.props
    const { selectedRowKeys, selectedRowKeysAudience } = this.state

    Modal.confirm({
      title: `Do you want to move to this audiences?`,
      //  eslint-disable-next-line
      content: `Subscriber will add to audiences after click OK `,
      onOk: () => {
        console.log(`OK ${selectedRowKeys}`)
        dispatch({
          type: 'subscriber/MOVING_SUBSCRIBER_TO_AUDIENCE',
          payload: {
            selectedRowKeys,
            selectedRowKeysAudience,
          },
        })
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  handleCancel = () => {
    this.setState({ movingVisible: false })
    this.setState({ visible: false })
  }

  //  handle search
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select())
      }
    },
    render: text =>
      //  eslint-disable-next-line
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          //  eslint-disable-next-line
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  })

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    })
  }

  handleReset = clearFilters => {
    clearFilters()
    this.setState({ searchText: '' })
  }
  //  end search

  // filter date
  setDateSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'lastModifiedDate',
      },
    })
  }

  handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter)
    this.setState({
      // filteredInfo: filters,
      sortedInfo: sorter,
    })
  }

  //  end

  render() {
    // eslint-disable-next-line
    const { getFieldDecorator } = this.props.form
    const { subscriber } = this.props
    const {
      subscribers,
      // subscriberTypes
    } = subscriber
    const { loading, selectedRowKeys, selectedRowKeysAudience } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const rowSelectionMoving = {
      selectedRowKeysAudience,
      onChange: this.onSelectChangeAudience,
    }
    const { audience } = this.props
    const { audienceData } = audience
    let { sortedInfo } = this.state
    sortedInfo = sortedInfo || {}
    // filteredInfo = filteredInfo || {};

    //  start modal
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 24,
          offset: 10,
        },
      },
    }

    // const menu = () => {
    //   return (
    //     <Menu onClick={this.showConfirm}>
    //       {!subscriberTypes
    //         ? null
    //         : subscriberTypes.map(item => {
    //             return (
    //               // eslint-disable-next-line
    //               <Menu.Item key={item.id} value={item.id}>
    //                 <Icon type="user" />
    //                 {item.name}
    //               </Menu.Item>
    //             )
    //           })}
    //     </Menu>
    //   )
    // }

    const hasSelected = selectedRowKeys.length > 0
    // const hasSelectedTag = selectedItems.length > 0
    const columns = [
      {
        title: 'Email',
        width: 200,
        dataIndex: 'email',
        key: '1',
        // fixed: 'left',
        render: email => <Link to="/subscriber/subscribers/detail">{email}</Link>,
        ...this.getColumnSearchProps('email'),
      },
      {
        title: 'First name',
        dataIndex: 'firstName',
        key: '6',
        width: 220,
        ...this.getColumnSearchProps('firstName'),
      },
      {
        title: 'Last name',
        dataIndex: 'lastName',
        key: '7',
        width: 220,
        ...this.getColumnSearchProps('lastName'),
      },
      // {
      //   title: 'Email Marketing',
      //   dataIndex: 'email',
      //   key: '3',
      //   width: 200,
      // },
      {
        title: 'Type',
        dataIndex: 'typeName',
        key: '9',
        width: 200,
        render: typeName => (
          <div>
            <Tag
              color={
                (typeName === 'Subscriber' ? 'green' : '') ||
                (typeName === 'Customer' ? 'blue' : '')
              }
            >
              {typeName}
            </Tag>
          </div>
        ),
      },
      {
        title: 'Lastest changed',
        dataIndex: 'lastModifiedDate',
        key: 'lastModifiedDate',
        width: 200,
        render: lastModifiedDate => <Moment format="MM/DD/YYYY HH:mm">{lastModifiedDate}</Moment>,
        sorter: (a, b) => new Date(a.lastModifiedDate) - new Date(b.lastModifiedDate),
        sortOrder: sortedInfo.columnKey === 'lastModifiedDate' && sortedInfo.order,
        ellipsis: true,
      },
    ]

    const columnAudience = [
      {
        title: 'Audience Name',
        dataIndex: 'name',
        key: '1',
        width: '100%',
      },
    ]
    // eslint-disable-next-line
    return (
      <section className="card">
        <Row type="flex" justify="center" className="card-body">
          <Col span={22}>
            <div>
              <div>
                <Modal
                  title="Select audience"
                  // eslint-disable-next-line
                  visible={this.state.movingVisible}
                  onCancel={this.handleCancel}
                  footer={[
                    <Button type="default" onClick={this.handleCancel}>
                      Close
                    </Button>,
                    <Button type="primary" onClick={this.handleMoveSubToAudience}>
                      Move now
                    </Button>,
                  ]}
                >
                  <Table
                    rowSelection={rowSelectionMoving}
                    columns={columnAudience}
                    dataSource={audienceData}
                    // scroll={{ x: 1100, y: 600 }}
                    rowKey={record => record.id}
                  />
                </Modal>
                <Modal
                  // eslint-disable-next-line
                  title={this.state.obj.id ? 'Update Subscriber' : 'Add Subscriber*'}
                  // eslint-disable-next-line
                  visible={this.state.visible}
                  onCancel={this.handleCancel}
                  footer={[
                    <Button type="primary" onClick={this.handleOk}>
                      Close
                    </Button>,
                  ]}
                >
                  <Form
                    {...formItemLayout}
                    onSubmit={
                      //  eslint-disable-next-line
                      !this.state.obj.id ? this.handleSubmit : this.handleUpdate
                    }
                  >
                    <Form.Item type="hidden">
                      {getFieldDecorator('id', {
                        //  eslint-disable-next-line
                        initialValue: this.state.obj.id || '',
                      })(<Input type="hidden" placeholder="id" />)}
                    </Form.Item>
                    <Form.Item label="E-mail">
                      {getFieldDecorator('email', {
                        //  eslint-disable-next-line
                        initialValue: this.state.obj.email,
                        rules: [
                          {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                          },
                          {
                            required: true,
                            message: 'Please input E-mail!',
                          },
                        ],
                      })(<Input placeholder="Email" />)}
                    </Form.Item>
                    <Form.Item label="First name">
                      {getFieldDecorator('firstName', {
                        //  eslint-disable-next-line
                        initialValue: this.state.obj.first_name,
                        rules: [
                          {
                            required: true,
                            message: 'Please input first name!',
                          },
                        ],
                      })(<Input placeholder="First name" />)}
                    </Form.Item>
                    <Form.Item label="Last name">
                      {getFieldDecorator('lastName', {
                        //  eslint-disable-next-line
                        initialValue: this.state.obj.last_name,
                        rules: [
                          {
                            required: true,
                            message: 'Please input last name!',
                          },
                        ],
                      })(<Input placeholder="Last name" />)}
                    </Form.Item>
                    <Form.Item label="Total spent">
                      {getFieldDecorator('totalSpent', {
                        //  eslint-disable-next-line
                        initialValue: this.state.obj.total_spent,
                        rules: [
                          {
                            required: true,
                            message: 'Please input total spent!',
                          },
                        ],
                      })(<InputNumber min={0} placeholder="Total spent" />)}
                    </Form.Item>
                    <Form.Item label="Total order">
                      {getFieldDecorator('orderCount', {
                        //  eslint-disable-next-line
                        initialValue: this.state.obj.order_count,
                        rules: [
                          {
                            required: true,
                            message: 'Please input your total order!',
                          },
                        ],
                      })(<InputNumber min={0} placeholder="Total order" />)}
                    </Form.Item>
                    <Form.Item label="Cancelled order times">
                      {getFieldDecorator('cancelOrderTimes', {
                        //  eslint-disable-next-line
                        initialValue: this.state.obj.cancelled_order,
                        rules: [
                          {
                            required: true,
                            message: 'Please input cancelled order times!',
                          },
                        ],
                      })(<InputNumber min={0} placeholder="Cancelled order times" />)}
                    </Form.Item>
                    {/* <Form.Item label="Type">
                {getFieldDecorator('typeId', {
                  rules: [
                    {
                      required: true,
                      message: 'Please select at a type!',
                    },
                  ],
                })(
                  <Select placeholder="Select a type">
                    {!subscriberTypes
                      ? null
                      : subscriberTypes.map(item => (
                          //  eslint-disable-next-line
                          <Select.Option key={item.id} value={item.id}>
                            {item.name}
                          </Select.Option>
                        ))}
                  </Select>,
                )}
              </Form.Item> */}

                    <Form.Item {...tailFormItemLayout}>
                      <Button type="primary" htmlType="submit">
                        {//  eslint-disable-next-line
                        !this.state.obj.id ? 'Save' : 'Update'}
                      </Button>
                    </Form.Item>
                  </Form>
                </Modal>
              </div>
              <Row style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={this.start} loading={loading}>
                  Reload
                </Button>
                {/* <Dropdown.Button
            style={{ marginLeft: '3px' }}
            disabled={!hasSelected}
            onClick={handleButtonClick}
            overlay={menu}
            icon={<Icon type="down" />}
          >
            Change Type
          </Dropdown.Button> */}
                <Button
                  type="dashed"
                  // onClick={this.handleMoveSubToAudience}
                  disabled={!hasSelected}
                  style={{ marginLeft: '5px' }}
                  onClick={this.showModalMovingSub}
                >
                  Move to Audience
                </Button>
                <Button
                  type="danger"
                  onClick={this.handleDelete}
                  disabled={!hasSelected}
                  style={{ marginLeft: '5px' }}
                >
                  Delete
                </Button>
                <Button
                  type="primary"
                  style={{ float: 'right', marginLeft: '5px' }}
                  onClick={this.routeChange}
                >
                  <Icon type="user-add" />
                  Import Excel
                </Button>
                <Button type="primary" onClick={this.showModal} style={{ float: 'right' }}>
                  <Icon type="user-add" />
                  Add Subscriber
                </Button>
              </Row>
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={subscribers}
                // scroll={{ x: 1100, y: 600 }}
                rowKey={record => record.id}
                onChange={this.handleChange}
                onRow={record => {
                  return {
                    //  eslint-disable-next-line
                    onClick: () => {
                      //  eslint-disable-next-line
                      // const { dispatch } = this.props
                      // dispatch({
                      //   type: 'audience/GET_AUDIENCE_SUBSCRIBERS',
                      //   payload: { audienceId: record.id },
                      // })
                      // dispatch({
                      //   type: 'audience/SET_STATE',
                      //   payload: { audienceId: record.id },
                      // })
                      // //  eslint-disable-next-line
                      // this.props.history.push('../subscriber/audiences/detail')
                      this.setState({
                        visible: true,
                        obj: {
                          id: record.id,
                          email: record.email,
                          last_name: record.lastName,
                          first_name: record.firstName,
                          order_count: record.orders_count,
                          cancelled_order: record.cancelled_order_times,
                          total_spent: record.total_spent,
                        },
                      })
                      //  eslint-disable-next-line
                      console.log(`${record}`)

                      // console.log(JSON.stringify(record))
                    },
                  }
                }}
              />
            </div>
          </Col>
        </Row>
      </section>
    )
  }
}

// ReactDOM.render(
//   <Table columns={columns} dataSource={data} scroll={{ x: 1500, y: 300 }} />
// );
export default Subscriber
