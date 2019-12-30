/* eslint-disable */
import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  Icon,
  Button,
  Tabs,
  Table,
  Tag,
  Divider,
  Input,
  Form,
  Modal,
  notification,
} from 'antd'
import Moment from 'react-moment'
import Highlighter from 'react-highlight-words'

const { TabPane } = Tabs
const { Search } = Input
const { confirm } = Modal

/* --------------------------------------------------------------- */

// CREATE CAMPAIGN FORM
const CampaignCreateForm = Form.create({ name: 'new_newsletter_in_modal' })(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props
      const { getFieldDecorator } = form
      return (
        <Modal
          visible={visible}
          title="Create Campaign"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Campaign name">
              {getFieldDecorator('campaignName', {
                initialValue: '',
                rules: [{ required: true, message: 'Please input the campaign name' }],
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      )
    }
  },
)
// CREATE CAMPAIGN FORM -- END

/* --------------------------------------------------------------- */
@connect(({ campaign }) => ({ campaign }))
// MAIN CODE
class CampaignHome extends React.Component {
  constructor(props) {
    super(props)
    this.props = props
  }

  state = {
    visible: false,
    history: this.props.history,
    selectedRowKeys: [],
    searchText: '',
    searchedColumn: '',
    sortedInfo: null,
  }

  componentDidMount = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'campaign/GET_ALL_CAMPAIGNS',
    })
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
  // end
  //  handle sort
  setDateSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'lastModified',
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
  /* --------------------------------------------------------------- */

  // CREATE CAMPAIGN HANDLING FUNCTIONS
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
        console.log('Campaign name: ', values)
        localStorage.setItem('campaignName', values.campaignName)
        const { dispatch } = this.props
        dispatch({
          type: 'campaign/SAVE_CAMPAIGN_NAME',
          payload: values,
        })

        // localStorage.setItem('currentNewsletter', JSON.stringify(newsletter))

        form.resetFields()
        this.props.history.push({
          pathname: `/campaign/create/`,
          // state: { newsletter: values },
        })
        this.setState({ visible: false })
      }
    })
  }

  saveFormRef = formRef => {
    this.formRef = formRef
  }
  // CREATE CAMPAIGN HANDLING FUNCTIONS -- END

  /* --------------------------------------------------------------- */

  // CAMPAIGN TABLE HANDLING FUNCTIONS
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys })
    console.log(`selected row keys: ${JSON.stringify(selectedRowKeys)}`)
  }

  deselectAll = () => {
    this.setState({ selectedRowKeys: [] })
  }

  deleteCampaigns = () => {
    //  eslint-disable-next-line
    const { dispatch } = this.props
    const { selectedRowKeys } = this.state
    //  eslint-disable-next-line
    confirm({
      title: `Delete selected campaign(s)?`,
      content: `Select campaign(s) will be removed. Do you want to continue?`,
      onOk() {
        console.log(`OK ${JSON.stringify(selectedRowKeys)}`)

        dispatch({
          type: 'campaign/DELETE_CAMPAIGNS',
          payload: { selectedRowKeys },
        })
      },
      onCancel() {
        console.log(`Cancel`)
      },
    })
    this.setState({ selectedRowKeys: [] })
  }

  getCampaignById = id => {
    const { dispatch } = this.props
    localStorage.setItem('campaignId', id)
    dispatch({
      type: 'campaign/GET_CAMPAIGN_BY_ID',
      payload: { id },
    })
    setTimeout(
      function() {
        this.props.history.push('./update')
      }.bind(this),
      2000,
    )
  }
  // CAMPAIGN TABLE HANDLING FUNCTIONS -- END

  /* --------------------------------------------------------------- */

  // MAIN RENDERING
  render() {
    const { selectedRowKeys } = this.state
    const { campaign } = this.props
    const { campaigns } = campaign
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const hasSelected = selectedRowKeys.length > 0
    let { sortedInfo } = this.state
    sortedInfo = sortedInfo || {}

    // TABLE COLUMN DEFINITION
    const tblCampaignCols = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps('name'),
      },
      {
        title: 'Status',
        dataIndex: 'statusId',
        key: 'status',
        render: statusId => {
          let color = 'volcano'
          let statusName = ''
          if (statusId === 'c0316ed0-5fb4-491c-a581-62a251b1be8d') {
            color = 'green'
            statusName = 'Available'
          } else if (statusId === '4cece002-1ae6-4bad-9633-ab30dc55b4e5') {
            color = 'blue'
            statusName = 'Running'
          } else if (statusId === 'bd1b5402-4de9-44b3-8804-38b8ff271a17') {
            color = 'red'
            statusName = 'Paused'
          }

          return (
            <Tag color={color} key={statusId} style={{ width: 100, textAlign: 'center' }}>
              {statusName.toUpperCase()}
            </Tag>
          )
        },
      },
      {
        title: 'Last Modified',
        dataIndex: 'lastModified',
        key: 'lastModified',
        render: lastModified => <Moment format="MM/DD/YYYY HH:mm">{lastModified}</Moment>,
        sorter: (a, b) => new Date(a.lastModified) - new Date(b.lastModified),
        sortOrder: sortedInfo.columnKey === 'lastModified' && sortedInfo.order,
        ellipsis: true,
      },
    ]
    // TABLE COLUMN DEFINITION -- END

    return (
      <section className="card">
        <Helmet title="Newsletters" />
        <Row type="flex" justify="center" className="card-body">
          <Col span={24}>
            <Row type="flex" justify="start">
              <Col span={17}>
                <Row type="flex" justify="start">
                  <Col span={23}>
                    <h1>Campaign</h1>
                    <h4>Campaign helps you take care customers like VIPs</h4>
                  </Col>
                </Row>
              </Col>
              <Col span={7} style={{ paddingTop: 15 }}>
                <Row type="flex" justify="end">
                  <Button type="primary" size="large" onClick={this.showModal}>
                    Create Campaign
                  </Button>
                  <CampaignCreateForm
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
              <Col span={20}>
                <div>
                  <Row type="flex" justify="start">
                    <Col span={10}>
                      <Divider type="vertical" />
                      <Button type="primary" disabled={!hasSelected} onClick={this.deselectAll}>
                        Deselect All
                      </Button>
                      <Button
                        type="danger"
                        disabled={!hasSelected}
                        onClick={this.deleteCampaigns}
                        style={{ marginLeft: 10 }}
                      >
                        Delete
                      </Button>
                      <Divider type="vertical" />
                      <span style={{ marginLeft: 8 }}>
                        {hasSelected ? `${selectedRowKeys.length} selected` : ''}
                      </span>
                    </Col>
                    {/* <Col span={10} offset={4}>
                      <Search
                        placeholder="Find a campaign by name"
                        onSearch={value => console.log(value)}
                        style={{ width: 300, float: 'right' }}
                      />
                    </Col> */}
                  </Row>
                  <Divider />

                  <Table
                    // showHeader={true}
                    rowSelection={rowSelection}
                    columns={tblCampaignCols}
                    dataSource={campaigns}
                    rowKey={record => record.id}
                    onChange={this.handleChange}
                    onRow={(record, rowIndex) => {
                      return {
                        // eslint-disable-next-line
                        onClick: () => {
                          this.getCampaignById(record.id)
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

export default CampaignHome
