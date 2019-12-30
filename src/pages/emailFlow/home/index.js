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
import Highlighter from 'react-highlight-words'

const { Step } = Steps
const FormItem = Form.Item
const { Option } = Select
const { Search } = Input
const { confirm } = Modal

const defaultActionDuration = 12
const defaultConditionDuration = 6

/* --------------------------------------------------------------- */

// CREATE EMAILFLOW FORM

const EmailFlowCreateForm = Form.create({ name: 'new_emailFlow_in_modal' })(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props
      const { getFieldDecorator } = form
      return (
        <Modal
          visible={visible}
          title="Create Email Flow"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Email flow name">
              {getFieldDecorator('emailFlowName', {
                initialValue: '',
                rules: [{ required: true, message: 'Please input the email flow name' }],
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      )
    }
  },
)
// CREATE EMAILFLOW FORM -- END
/* --------------------------------------------------------------- */

// MAIN CODE
@connect(({ emailFlow }) => ({ emailFlow }))
class EmailflowHome extends React.Component {
  state = {
    visible: false,
    history: this.props.history,
    dispatch: this.props.dispatch,
    selectedRowKeys: [],
    loading: !this.props.emailFlow.pageLoading ? false : this.props.emailFlow.pageLoading,
    searchText: '',
    searchedColumn: '',
  }

  componentDidMount = () => {
    console.log('SAGAS DELETING UNNECCESSARY LOCAL STORAGE VARIABLES ...')
    localStorage.removeItem('currEmailFlow')
    localStorage.removeItem('emailFlowHandlingStatus')
    console.log('SAGAS FINISHED DELETING UNNECCESSARY LOCAL STORAGE VARIABLES')

    console.log('EMAILFLOW_HOME_PAGE componentDidMount PROPS', this.props)

    this.state.dispatch({
      type: 'emailFlow/GET_EMAIL_FLOWS',
    })
    // dispatch({
    //   type: 'newsletter/GET_NEWSLETTERS',
    // })
  }

  componentWillReceiveProps(nextProps) {
    console.log('EMAILFLOW_HOME_PAGE componentWillReceiveProps PROPS', nextProps)
    // this.setState({ nextProps })
  }

  /* --------------------------------------------------------------- */

  // CREATE EMAILFLOW HANDLING FUNCTIONS
  showModal = () => {
    this.setState({ visible: true })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  handleCreate = () => {
    const { form } = this.formRef.props
    // const { dispatch } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Email flow name: ', values)
        // const { dispatch } = this.props

        const emailFlow = {
          id: null,
          lastModifiedDate: new Date(),
          name: values.emailFlowName,
          status: {
            name: 'Available',
          },
          stepSequence: {
            stepCommonData: {
              id: null,
              startDuration: defaultActionDuration,
              stepType: {
                name: 'Action',
                id: 'ffc65803-68fb-4b2c-94f9-97e239bd93a8',
              },
            },
            newsletter: {
              id: null,
              name: null,
            },
            nextStep: {
              stepCommonData: {
                id: null,
                startDuration: defaultConditionDuration,
                stepType: {
                  name: 'Condition',
                  id: 'f22c1d0b-e1d4-4836-a693-d5a88e4705d4',
                },
              },
              conditionType: {
                name: null,
                description: null,
              },
              matchedStep: {
                stepCommonData: {
                  id: null,
                  startDuration: defaultConditionDuration,
                  stepType: {
                    name: 'Action',
                    id: 'ffc65803-68fb-4b2c-94f9-97e239bd93a8',
                  },
                },
                newsletter: {
                  id: null,
                  name: null,
                },
                nextStep: null,
              },
              failedStep: {
                stepCommonData: {
                  id: null,
                  startDuration: defaultConditionDuration,
                  stepType: {
                    name: 'Action',
                    id: 'ffc65803-68fb-4b2c-94f9-97e239bd93a8',
                  },
                },
                newsletter: {
                  id: null,
                  name: null,
                },
                nextStep: null,
              },
            },
          },
        }

        // dispatch({
        //   type: 'campaign/SAVE_EMAILFLOW_NAME',
        //   payload: values,
        // })

        localStorage.setItem('currEmailFlow', JSON.stringify(emailFlow))
        localStorage.setItem(
          'emailFlowHandlingStatus',
          JSON.stringify({
            handlingStatus: {
              create: true,
              edit: false,
            },
          }),
        )

        form.resetFields()
        this.props.history.push({
          pathname: `/emailFlow/create`,
          // state: { newsletter: values },
        })
        this.setState({ visible: false })
      }
    })
  }

  saveFormRef = formRef => {
    this.formRef = formRef
  }
  // CREATE EMAILFLOW HANDLING FUNCTIONS -- END

  /* --------------------------------------------------------------- */

  // EMAILFLOW TABLE HANDLING FUNCTIONS
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys })
    console.log(`selected row keys: ${JSON.stringify(selectedRowKeys)}`)
  }

  deselectAll = () => {
    this.setState({ selectedRowKeys: [] })
  }

  deleteEmailFlows = () => {
    const { dispatch } = this.props
    const { selectedRowKeys } = this.state
    //  eslint-disable-next-line
    confirm({
      title: `Delete selected email flow(s)?`,
      content: `Selected email flow(s) will be removed. Do you want to continue?`,
      onOk() {
        console.log(`OK ${JSON.stringify(selectedRowKeys)}`)

        dispatch({
          type: 'emailFlow/DELETE_EMAIL_FLOWS',
          payload: { selectedRowKeys },
        })

        // setTimeout(() => {
        //   dispatch({
        //     type: 'emailFlow/GET_EMAIL_FLOWS',
        //   })
        // }, 2000)
      },
      onCancel() {
        console.log(`Cancel`)
      },
    })
    this.setState({ selectedRowKeys: [] })
  }

  getEmailFlowById = emailFlowId => {
    console.log('SelectedEmailFlowId', emailFlowId)
    this.state.dispatch({
      type: 'emailFlow/GET_EMAIL_FLOW_BY_ID',
      payload: {
        selectedEmailFlowId: emailFlowId,
      },
    })

    localStorage.setItem(
      'emailFlowHandlingStatus',
      JSON.stringify({
        handlingStatus: {
          create: false,
          edit: true,
        },
      }),
    )
    this.state.history.push(`emailflow/edit/${emailFlowId}`)
  }

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
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
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
  // EMAILFLOW TABLE HANDLING FUNCTIONS -- END

  /* --------------------------------------------------------------- */

  // MAIN RENDERING
  render() {
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const hasSelected = selectedRowKeys.length > 0

    // TABLE COLUMN DEFINITION
    const tblEmailflowCols = [
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        ...this.getColumnSearchProps('name'),
        // onCell: (record, rowIndex) => {
        //   onclick:
        // }
      },
      // {
      //   title: 'Start Date',
      //   dataIndex: 'startDate',
      // },
      {
        key: 'status',
        title: 'Status',
        dataIndex: 'status',
        render: status => {
          let color = 'volcano'
          if (status.name === 'Available') {
            color = 'green'
          } else if (status.name === 'Running') {
            color = 'geekblue'
          } else if (status.name === 'Paused') {
            color = 'red'
          }

          return (
            <Tag color={color} key={status.name} style={{ width: 100, textAlign: 'center' }}>
              {status.name.toUpperCase()}
            </Tag>
          )
        },
      },
      {
        key: 'lastModified',
        title: 'Last Modified',
        dataIndex: 'lastModifiedDate',
        render: lastModified => {
          return <Moment format="MM/DD/YYYY HH:mm:ss">{lastModified}</Moment>
        },
      },
    ]
    // TABLE COLUMN DEFINITION -- END
    // TABLE DATA
    const { emailFlow } = this.props
    let emailFlowList = emailFlow.emailFlows
    const { loading } = this.state

    return (
      <section className="card">
        <Helmet title="Email Flow" />
        <Row type="flex" justify="center" className="card-body">
          <Col span={24}>
            <Row type="flex" justify="start">
              <Col span={17}>
                <Row type="flex" justify="start">
                  <Col span={23}>
                    <h1>Email Flow</h1>
                    <h4>You can define your own running flow</h4>
                  </Col>
                </Row>
              </Col>
              <Col span={7} style={{ paddingTop: 15 }}>
                <Row type="flex" justify="end">
                  <Button type="primary" size="large" onClick={this.showModal}>
                    Create Email Flow
                  </Button>
                  <EmailFlowCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                  />
                </Row>
              </Col>
            </Row>
            <br />
            <br />
            <Row type="flex" justify="center">
              {/* <Col span={4} style={{ width: 190 }}>
              <div className="card" style={{ height: 25 }}>
                {['']}
              </div>
              <Divider />
              <ViewByStatus />
            </Col> */}

              <Col span={20}>
                {/* EMAILFLOW BODY */}
                <div>
                  <Row type="flex" justify="start">
                    <Col span={12}>
                      <Divider type="vertical" />
                      <Button type="primary" disabled={!hasSelected} onClick={this.deselectAll}>
                        Deselect All
                      </Button>
                      <Button
                        type="danger"
                        disabled={!hasSelected}
                        onClick={this.deleteEmailFlows}
                        style={{ marginLeft: 10 }}
                      >
                        Delete
                      </Button>
                      <Divider type="vertical" />
                      <span style={{ marginLeft: 8 }}>
                        {hasSelected ? `${selectedRowKeys.length} selected` : ''}
                      </span>
                    </Col>
                    <Col span={18} offset={4}>
                      {/* <Search
                        placeholder="Find an email flow by name"
                        onSearch={value => console.log(value)}
                        style={{ width: 300, float: 'right' }}
                      /> */}
                    </Col>
                  </Row>
                  <Divider />

                  <Table
                    // showHeader={true}
                    loading={this.props.emailFlow.pageLoading}
                    rowSelection={rowSelection}
                    columns={tblEmailflowCols}
                    dataSource={
                      // [{
                      //   name: 'Open email flow',
                      //   // startDate: '12/12/12',
                      //   statusName: 'Available',
                      //   lastModified: '12/12/12',
                      // },]
                      emailFlowList
                    }
                    rowKey={record => record.id}
                    onRow={(record, rowIndex) => {
                      return {
                        onClick: () => {
                          this.getEmailFlowById(record.id)
                        },
                      }
                    }}
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </section>
    )
  }
}

export default EmailflowHome
