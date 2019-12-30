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

/* --------------------------------------------------------------- */

// NEWSLETTER CREATE FORM

const NewsletterCreateForm = Form.create({ name: 'new_newsletter_in_modal' })(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props
      const { getFieldDecorator } = form
      return (
        <Modal
          visible={visible}
          title="Create Newsletter"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Newsletter name">
              {getFieldDecorator('newsletterName', {
                rules: [{ required: true, message: 'Please input the newsletter name' }],
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      )
    }
  },
)

// NEWSLETTER SEND FORM - END

/* --------------------------------------------------------------- */

// MAIN CODE
@connect(({ newsletter }) => ({ newsletter }))
class NewsletterHome extends React.Component {
  state = {
    visible: false,
    // eslint-disable-next-line
    history: this.props.history,
    dispatch: this.props.dispatch,
    selectedNewsletters: [],
    pageLoading: false,
    searchText: '',
    searchedColumn: '',
  }

  componentDidMount = () => {
    console.log('SAGAS DELETING UNNECCESSARY LOCAL STORAGE VARIABLES ...')
    localStorage.removeItem('currNewsletter')
    localStorage.removeItem('emailContentSaved')
    console.log('SAGAS FINISHED DELETING UNNECCESSARY LOCAL STORAGE VARIABLES')

    console.log('NEWSLETTER_HOME_PAGE componentDidMount PROPS', this.props)

    this.state.dispatch({ type: 'newsletter/GET_NEWSLETTERS' })
    this.props.newsletter.pageLoading = false
  }

  componentWillReceiveProps(nextProps) {
    console.log('NEWSLETTER_HOME_PAGE componentWillReceiveProps PROPS', nextProps)
    // this.setState({ nextProps })
  }

  /* --------------------------------------------------------------- */

  // PAGE HEADER HANDLING FUNCTIONS

  showModal = () => {
    this.setState({ visible: true })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  handleCreate = () => {
    const { form } = this.formRef.props
    const { dispatch } = this.props
    form.validateFields((err, values) => {
      if (err) {
        return
      }

      dispatch({
        type: 'newsletter/CREATE_NEWSLETTER',
        payload: {
          currNewsletter: {
            name: values.newsletterName,
          },
        },
      })

      form.resetFields()

      this.state.history.push({
        pathname: `/newsletter/create/`,
        // state: { currNewsletter: this.props.newsletter.currNewsletter },
      })
      this.setState({ visible: false })
    })
  }

  saveFormRef = formRef => {
    this.formRef = formRef
  }
  // PAGE HEADER HANDLING FUNCTIONS -- END

  /* --------------------------------------------------------------- */

  // PAGE BODY HANDLING FUNCTIONS
  onSelectChange = selectedNewsletters => {
    this.setState({ selectedNewsletters })
    console.log('Newsletter Table selected row keys:', selectedNewsletters)
    this.state.dispatch({
      type: 'newsletter/SET_STATE',
      payload: {
        selectedNewsletters,
      },
    })
  }

  deselectAll = () => {
    this.setState({ selectedNewsletters: [] })
    this.state.dispatch({
      type: 'newsletter/SET_STATE',
      payload: {
        selectedNewsletters: [],
      },
    })
  }

  deleteNewsletters = () => {
    const { selectedNewsletters, dispatch, pageLoading } = this.state
    const props = this
    confirm({
      title: `Delete selected newsletter(s)?`,
      content: `Selected newsletter(s) will be removed and cannot be recovered. Do you want to continue?`,
      onOk() {
        dispatch({
          type: 'newsletter/DELETE_NEWSLETTERS',
          payload: { selectedNewsletters },
        })
        dispatch({ type: 'newsletter/GET_NEWSLETTERS' })

        props.setState({ selectedNewsletters: [] })
        // this.set selectedNewsletters = []

        setTimeout(() => {
          window.location.reload()
        }, 2000)
      },
      onCancel() {
        console.log(`Cancel`)
        props.setState({ pageLoading: false })
      },
    })
    this.setState({ pageLoading: true })
  }

  getNewsletterById = id => {
    console.log('Table Newsletter onRow click', id)
    this.state.dispatch({
      type: 'newsletter/GET_NEWSLETTER_BY_ID',
      payload: {
        selectedNewsletter: id,
      },
    })
    this.state.history.push(`newsletter/edit/${id}`)
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

  // PAGE BODY HANDLING FUNCTIONS -- END

  /* --------------------------------------------------------------- */

  // MAIN RENDERING
  render() {
    console.log('NEWSLETTER HOME PAGE render', this.props)

    const { newsletterList } = !this.props.newsletter ? null : this.props.newsletter

    // TABLE Row Selection
    const { selectedNewsletters } = this.state
    const rowSelection = {
      selectedRowKeys: selectedNewsletters,
      onChange: this.onSelectChange,
    }
    const hasSelected = selectedNewsletters.length > 0

    // TABLE COLUMNS DEFINITION
    const tblNewsletterCols = [
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        ...this.getColumnSearchProps('name'),
        // onCell: (record, rowIndex) => {
        //   onclick:
        // }
      },
      {
        key: 'status',
        title: 'Status',
        dataIndex: 'status',
        render: statusName => {
          let color = 'volcano'
          if (statusName === 'Available') {
            color = 'green'
          } else if (statusName === 'Running') {
            color = 'geekblue'
          } else if (statusName === 'Paused') {
            color = 'red'
          }

          return (
            <Tag color={color} key={statusName} style={{ width: 100, textAlign: 'center' }}>
              {statusName.toUpperCase()}
            </Tag>
          )
        },
      },
      {
        key: 'lastModified',
        title: 'Last Modified',
        dataIndex: 'last_modified_date',
        render: lastModified => {
          return <Moment format="MM/DD/YYYY HH:mm:ss">{lastModified}</Moment>
        },
      },
      // {
      //   dataIndex: 'action',
      // },
    ]
    // TABLE COLUMNS DEFINITION -- END
    const { pageLoading } = this.state

    if (pageLoading) {
      return (
        <section className="card">
          <Helmet title="Create Newsletter" />
          <Row type="flex" justify="center">
            <Col span={12}>
              <Spin
                style={{
                  backgroundColor: 'inherit',
                  width: '100%',
                }}
                spinning={pageLoading}
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
          <Helmet title="Newsletters" />

          {/* PAGE HEADER */}

          <Row type="flex" justify="start" className="card-body">
            <Col span={17}>
              <Row type="flex" justify="start">
                <Col span={23}>
                  <h1>Newsletters</h1>
                  <h3>You can manage all newsletters here.</h3>
                </Col>
              </Row>
            </Col>
            <Col span={7} style={{ paddingTop: 15 }}>
              <Row type="flex" justify="end">
                <Button type="primary" size="large" onClick={this.showModal}>
                  Create Newsletter
                </Button>
                <NewsletterCreateForm
                  wrappedComponentRef={this.saveFormRef}
                  // eslint-disable-next-line react/destructuring-assignment
                  visible={this.state.visible}
                  onCancel={this.handleCancel}
                  onCreate={this.handleCreate}
                />
              </Row>
            </Col>
          </Row>

          {/* PAGE HEADER - END */}

          <Divider type="horizontal" />

          {/* -------- PAGE BODY --------*/}

          <Row type="flex" justify="center" className="card-body">
            <Col span={22}>
              {/* Body Top */}

              <Row type="flex" justify="start">
                <Col span={12}>
                  <Divider type="vertical" />
                  <Button type="primary" disabled={!hasSelected} onClick={this.deselectAll}>
                    Deselect All
                  </Button>
                  <Button
                    type="danger"
                    disabled={!hasSelected}
                    onClick={this.deleteNewsletters}
                    style={{ marginLeft: 10 }}
                  >
                    Delete
                  </Button>
                  <Divider type="vertical" />
                  <span style={{ marginLeft: 8 }}>
                    {hasSelected ? `${selectedNewsletters.length} selected` : ''}
                  </span>
                </Col>
                <Col span={8} offset={4}>
                  {/* <Search
                    placeholder="Find a newsletter by name"
                    onSearch={value => console.log(value)}
                    style={{ width: 300, float: 'right' }}
                  /> */}
                </Col>
              </Row>

              {/* Body Top -- End */}

              <Divider />

              {/* Body Bottom */}

              <Row type="flex" justify="center">
                <Col span={24}>
                  <Table
                    // showHeader={true}
                    // loading={!newsletterList ? true : false}
                    loading={pageLoading || (!newsletterList ? true : false)}
                    rowSelection={rowSelection}
                    columns={tblNewsletterCols}
                    dataSource={newsletterList}
                    rowKey={record => record.id}
                    onRow={(record, rowIndex) => {
                      return {
                        // eslint-disable-next-line
                        onClick: () => {
                          this.getNewsletterById(record.id)
                        },
                      }
                    }}
                  />
                </Col>
              </Row>

              {/* Body Bottom -- End */}
            </Col>
          </Row>
          {/* PAGE BODY -- END */}
        </section>
      )
    }
  }
}

export default NewsletterHome
