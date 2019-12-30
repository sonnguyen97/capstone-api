/* eslint-disable */
import React from 'react'
import XLSX from 'xlsx'
import { connect } from 'react-redux'
import { Table, Form, Upload, Icon, Button, notification, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { makeCols } from './MakeColumns'
import { SheetJSFT } from './types'

const columns = [
  {
    title: 'No',
    dataIndex: 'no',
    key: '0',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: '1',
  },
  {
    title: 'First name',
    dataIndex: 'first_name',
    key: '2',
  },
  {
    title: 'Last name',
    dataIndex: 'last_name',
    key: '3',
  },
  {
    title: 'Total spent',
    dataIndex: 'total_spent',
    key: '4',
  },
  {
    title: 'Total order',
    dataIndex: 'orders_count',
    key: '5',
  },
  {
    title: 'Total canceled order',
    dataIndex: 'cancelled_order_times',
    key: '6',
  },
  // {
  //   title: 'Type',
  //   dataIndex: 'type',
  //   key: '4',
  //   render: () => <Tag color="red">Visitor</Tag>,
  // },
]

@connect(({ visitor }) => ({ visitor }))
@Form.create()
class ExcelReader extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      valid: 0,
      invalid: 0,
      log: [],
      visible: false,
    }
    // this.handleFile = this.handleFile.bind(this)
    // this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.normFile = this.normFile.bind(this)
    this.dummyRequest = this.dummyRequest.bind(this)
  }

  // componentWillReceiveProps(nextProps) {
  //   // const { dispatch } = this.props
  //   console.log('componentWillReceiveProps', nextProps)
  //   this.setState(nextProps)
  //   // dispatch({
  //   //   type: 'subscriber/GET_DATA_SUBSCRIBERS',
  //   // })
  // }

  onViewLog = e => {
    this.setState({
      visible: true,
    })
  }

  handleLoad = e => {
    if (e.file.name.includes('.xlsx')) {
      if (e.fileList.length > 0) {
        const reader = new FileReader()
        const files = e.fileList[0].originFileObj
        //  eslint-disable-next-line
        this.props.form.validateFieldsAndScroll((err, values) => {
          // eslint-disable-next-line
          if (!err) {
            console.log('Received values of form: ', e.fileList[0].originFileObj)
            console.log('Received values of values: ', values)
            console.log(files)
            reader.onload = async es => {
              /* Parse data */
              const data = es.target.result
              const wb = XLSX.read(data, { type: 'array', bookVBA: true })
              /* Get first worksheet */
              const wsname = wb.SheetNames[0]
              const ws = wb.Sheets[wsname]
              /* Convert array of arrays */
              const s = XLSX.utils.sheet_to_json(ws)
              const listSubFiltered = []
              const listSubFilteredFailed = []
              const subParsed = s
              await subParsed.forEach(item => {
                if (
                  (item.orders_count === item.cancelled_order_times && item.total_spent > 0) ||
                  item.cancelled_order_times > item.orders_count
                ) {
                  listSubFilteredFailed.push(item)
                } else {
                  listSubFiltered.push(item)
                }
              })
              //    eslint-disable-next-line
              this.setState(
                //  eslint-disable-next-line
                {
                  data: listSubFiltered,
                  cols: makeCols(ws['!ref'], { skipUnderfined: true }),
                  valid: listSubFiltered.length,
                  invalid: listSubFilteredFailed.length,
                  log: listSubFilteredFailed,
                },
                () => {
                  //  eslint-disable-next-line
                  console.log(JSON.stringify(this.state.data, null, 2))
                },
              )
            }
            reader.readAsArrayBuffer(files)
          }
        })
      } else {
        this.setState({ data: [] })
      }
    } else {
      notification.error({
        message: 'File is not valid! Please choose file .xlsx!',
      })
    }
  }

  normFile = e => {
    console.log('Upload event', e)
    if (Array.isArray(e)) {
      return e
    }
    if (e.fileList.length > 1) {
      e.fileList.shift()
    }
    return e && e.fileList
  }

  dummyRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok')
    }, 0)
  }

  handleSubmit = () => {
    const { dispatch } = this.props
    const { data } = this.state
    if (data) {
      dispatch({
        type: 'subscriber/IMPORT_EXCEL_SUBSCRIBERS',
        payload: data,
      })
      // const path = `../subscriber/subscribers`
      // //  eslint-disable-next-line
      // this.props.history.push(path)
    }
  }
  handleCancel = () => {
    this.setState({ visible: false })
  }

  render() {
    const { data } = this.state
    //  eslint-disable-next-line
    const { getFieldDecorator } = this.props.form
    const visible = data.length === 0
    return (
      <div>
        <Modal
          width={800}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={[
            <Button type="default" onClick={this.handleCancel}>
              Close
            </Button>,
          ]}
        >
          <Table dataSource={this.state.log} columns={columns} rowKey={record => record.email} />
        </Modal>
        <Button type="primary">
          <Icon type="left" />
          <Link to="../subscriber/subscribers" style={{ color: 'white' }}>
            Go to Subscriber page
          </Link>
        </Button>
        <Form.Item>
          {getFieldDecorator('file', {
            //  eslint-disable-next-line
            // initialValue: this.props.dataSet && this.props.dataset.filename ? this.props.dataset.filename : [],
            valuePropName: 'fileList',
            getValueFromEvent: this.normFile,
          })(
            <Upload.Dragger
              name="file"
              accept={SheetJSFT}
              customRequest={this.dummyRequest}
              onChange={this.handleLoad}
            >
              {/* <Button>
                <Icon type="upload" /> Upload file
              </Button> */}
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from uploading subscriber
                data from excel file
              </p>
            </Upload.Dragger>,
          )}
        </Form.Item>
        <div>
          {this.state.invalid === 0 ? (
            ''
          ) : (
            <div>
              <span>
                Subscribers have {this.state.valid} valid and {this.state.invalid} invalid
              </span>{' '}
              <Button type="danger" onClick={this.onViewLog}>
                View invalid subscribers
              </Button>
              <span style={{ color: 'red', float: 'right' }}>
                *Note:
                <br />
                Total cancelled orders can't greater than total order.
                <br />
                Total spent cant greater than 0 when total orders equals total cancelled orders.
                <br />
              </span>
            </div>
          )}
          {/* <span>{this.state.invalid}</span> */}
          <Table dataSource={data} columns={columns} rowKey={record => record.no} />
        </div>
        <Button type="primary" onClick={this.handleSubmit} block disabled={visible}>
          Save
        </Button>
      </div>
    )
  }
}

export default ExcelReader
