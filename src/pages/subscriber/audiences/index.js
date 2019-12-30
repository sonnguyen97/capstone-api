import React from 'react'
import { Button, Icon, Table, Row, Modal, Input, Col } from 'antd'
import { Link } from 'react-router-dom'
// import styles from './style.module.scss'
import { connect } from 'react-redux'
import Moment from 'react-moment'
import Highlighter from 'react-highlight-words'

// const { confirm } = Modal
@connect(({ audience }) => ({ audience }))
class Audience extends React.Component {
  constructor(props) {
    super(props)
    this.props = props
    this.handleDelete = this.handleDelete.bind(this)
    this.start = this.start.bind(this)
  }

  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    searchText: '',
    searchedColumn: '',
    sortedInfo: null,
  }

  componentDidMount = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'audience/GET_AUDIENCE',
    })
  }

  start = () => {
    this.setState({ loading: true })
    const { dispatch } = this.props
    dispatch({
      type: 'audience/GET_AUDIENCE',
    })
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
    Modal.confirm({
      title: `Do you want to delete this audience?`,
      //  eslint-disable-next-line
      content: `Audience will deleted after click OK `,
      onOk: () => {
        console.log(`OK ${selectedRowKeys}`)
        dispatch({
          type: 'audience/DELETE_AUDIENCE',
          payload: {
            selectedRowKeys,
          },
        })
        this.setState({ selectedRowKeys: [] })
        dispatch({
          type: 'audience/GET_AUDIENCE',
        })
        this.start()
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  edit = id => {
    const { dispatch } = this.props
    dispatch({
      type: 'audience/GET_DEFINITION_AUDIENCE',
      payload: id,
    })
  }

  change = e => {
    e.stopPropagation()
    const id = e.target.attributes.value.nodeValue
    console.log(id)
    const { dispatch } = this.props
    //  eslint-disable-next-line
    this.props.history.push('../subscriber/audiences/edit')
    dispatch({
      type: 'audience/GET_DEFINITION_AUDIENCE',
      payload: { audienceId: id },
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
    const { audience } = this.props
    const { audienceData } = audience
    const { loading, selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const hasSelected = selectedRowKeys.length > 0
    let { sortedInfo } = this.state
    sortedInfo = sortedInfo || {}

    const columns = [
      {
        title: 'Audience Name',
        dataIndex: 'name',
        key: '1',
        width: '75%',
        ...this.getColumnSearchProps('name'),
      },
      {
        title: 'Lastest change',
        dataIndex: 'lastModifiedDate',
        key: 'lastModifiedDate',
        width: '25%',
        render: lastModifiedDate => <Moment format="MM/DD/YYYY HH:mm">{lastModifiedDate}</Moment>,
        sorter: (a, b) => new Date(a.lastModifiedDate) - new Date(b.lastModifiedDate),
        sortOrder: sortedInfo.columnKey === 'lastModifiedDate' && sortedInfo.order,
        ellipsis: true,
      },
      // {
      //   title: 'Action',
      //   key: '3',
      //   width: '5%',
      //   dataIndex: 'id',
      //   float: 'right',
      //   render: id => (
      //     <Button onClick={this.change} value={id}>
      //       <Icon type="edit" />
      //     </Button>
      //   ),
      // },
    ]

    return (
      <section className="card">
        <Row type="flex" justify="center" className="card-body">
          <Col span={22}>
            <div>
              <Row style={{ marginBottom: 16 }}>
                <Button type="primary" onClick={this.start} loading={loading}>
                  <Link to="/subscriber/audiences"> Reload</Link>
                </Button>
                <Button
                  type="danger"
                  onClick={this.handleDelete}
                  disabled={!hasSelected}
                  style={{ marginLeft: '5px' }}
                >
                  Remove
                </Button>
                <Button type="primary" style={{ float: 'right' }}>
                  <Link to="/subscriber/audiences/create-audience">
                    <Icon type="usergroup-add" />
                    Create Audience
                  </Link>
                </Button>
                {/* </Link> */}
              </Row>
              <Table
                rowKey={record => record.id}
                columns={columns}
                rowSelection={rowSelection}
                dataSource={audienceData}
                onChange={this.handleChange}
                //  eslint-disable-next-line
                onRow={(record, rowIndex) => {
                  return {
                    //  eslint-disable-next-line
                    onClick: () => {
                      //  eslint-disable-next-line
                      const { dispatch } = this.props
                      localStorage.removeItem('audienceDetail')
                      dispatch({
                        type: 'audience/GET_AUDIENCE_SUBSCRIBERS',
                        payload: { audienceId: record.id },
                      })
                      dispatch({
                        type: 'audience/SET_STATE',
                        payload: { audienceId: record.id },
                      })
                      //  eslint-disable-next-line
                      this.props.history.push('../subscriber/audiences/detail')
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

export default Audience
