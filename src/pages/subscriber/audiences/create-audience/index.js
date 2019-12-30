/* eslint-disable */
import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Row, Input, Form, Icon, Select, InputNumber, Divider } from 'antd'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'

const FormItem = Form.Item
let id = 0
// const value = 0
// function onBlur() {
//   console.log('blur')
// }

const SelectNewsletterForm = Form.create({ name: 'select_newsletter_form' })(
  class extends React.Component {
    constructor(props) {
      super(props)
      // this.typeSelected = this.typeSelected.bind(this)
    }
    state = {
      criterionObj: {},
      type: '',
      selectedFilterField: '',
      filterFields: [],
      filterExpressions: [],
      value: '',
    }

    typeSelected = e => {
      //  eslint-disable-next-line
      const { definition, form } = this.props
      // console.log(`${e} aasdasdasd`)
      // this.props.form.resetFields('Metric');
      //  eslint-disable-next-line
      definition.forEach(item => {
        if (item.id === e) {
          this.setState({
            criterionObj: item,
            filterFields: item.FilterField_CriterionTypes,
            type: item.id,
          })
        }
      })
    }

    filterFieldSelected = e => {
      //  eslint-disable-next-line
      const { filterFields, criterionObj } = this.state
      console.log(e)
      //  eslint-disable-next-line
      filterFields.forEach(item => {
        console.log(e)
        if (item.FilterField.id === e) {
          this.setState({
            filterExpressions: item.FilterField.FilterField_FilterExpressions,
            selectedFilterField: e,
            value: '',
          })
        }
      })
    }

    filterExpressionSelected = e => {
      //  eslint-disable-next-line
      const { filterExpressions } = this.state

      console.log(`${this.state.type} sssssssssssssssssssssss`)
      //  eslint-disable-next-line
      // filterFields.forEach(item => {
      console.log(this.state.selectedFilterField)
      // E-commerce
      if (this.state.type === 'fee67a7c-cbf5-4deb-abd3-33add96c35f7') {
        console.log(this.state.type)
        //total spent
        if (this.state.selectedFilterField === 'f174714c-2bba-46c1-a5d5-55e99f2f5583') {
          this.setState({ value: 'spent' })
        }
        if (
          //totalorder
          this.state.selectedFilterField === '3508a904-ee3d-4823-b392-7c04a1085294' ||
          //cancelled order times
          this.state.selectedFilterField === '676c95b0-7780-4085-b56f-a312fc57cd6d'
        ) {
          this.setState({ value: 'number' })
        }
      }
      //persional infor
      if (this.state.type === 'fee67a7c-cbf5-4deb-abd3-33add96c35f8') {
        // Total joined days
        if (this.state.selectedFilterField !== 'f174714c-2bba-46c1-a5d5-55e99f2f5997') {
          this.setState({
            value: 'string',
          })
        }
        if (this.state.selectedFilterField === 'f174714c-2bba-46c1-a5d5-55e99f2f5997') {
          this.setState({
            value: 'date',
          })
        }
      }
      // })
    }

    onChange(value) {
      console.log('changed', value)
    }

    render() {
      const { k, criterionTypes, getFieldDecorator, getFieldValue, keys, definition } = this.props

      const { criterionObj, filterFields, filterExpressions } = this.state
      // const { FilterField_CriterionTypes } = criterionObj
      // const { FilterField } = FilterField_CriterionTypes
      var type = []
      var filterField = []
      var filterExpression = []
      var count = 0
      var spent = 0
      var information = ''
      if (definition) {
        // newsletterChildren.push()
        definition.forEach(item => {
          type.push(
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>,
          )
        })
      }

      if (filterExpressions) {
        // newsletterChildren.push()
        filterExpressions.forEach(item => {
          filterExpression.push(
            <Select.Option key={item.FilterExpression.id} value={item.FilterExpression.id}>
              {item.FilterExpression.value}
            </Select.Option>,
          )
        })
      }
      if (filterFields) {
        // newsletterChildren.push()
        filterFields.forEach(item => {
          filterField.push(
            <Select.Option key={item.FilterField.id} value={item.FilterField.id}>
              {item.FilterField.name}
            </Select.Option>,
          )
        })
      }

      return (
        <div className={styles.formFilter} key={k - 1}>
          <Form.Item label="Criterion Type">
            {getFieldDecorator(`criterionType[${k - 1}]`, {
              rules: [
                {
                  required: true,
                  message: 'Please select a criterion type!',
                },
              ],

              // initialValue: [<Select.Option key={criterionObj.id ? type.id : null} value={criterionObj.name ? criterionObj.name : null}>{criterionObj.name ? criterionObj.name : null}</Select.Option>]
            })(
              <Select
                placeholder="Select a criterion type"
                optionFilterProp="children"
                onFocus={onFocus}
                onBlur={this.onBlur}
                onChange={this.typeSelected}
                key={1}
              >
                {/* {!definition ? null : (
                  //  eslint-disable-next-line
                  <Select.Option value={definition.id} key={definition.id}>
                    {definition.name}
                  </Select.Option>
                )} */}
                {type}
              </Select>,
            )}
          </Form.Item>
          <Row gutter={24}>
            <Col span={8}>
              {filterField.length === 0 ? null : (
                <Form.Item type="hidden">
                  {getFieldDecorator(`filterfield[${k - 1}]`, {
                    rules: [
                      {
                        required: true,
                        message: 'Please select a filter field!',
                      },
                    ],
                  })(
                    <Select placeholder="Select filter" onChange={this.filterFieldSelected}>
                      {/* {filterField.length === 0
                        ? null
                        : filterField.map(item => (
                          //  eslint-disable-next-line
                          <Select.Option key={item.id} value={item.id}>
                            {item.name}
                          </Select.Option>
                        ))} */}
                      {filterField}
                    </Select>,
                  )}
                </Form.Item>
              )}
            </Col>
            <Col span={8}>
              {filterExpression.length === 0 ? null : (
                <Form.Item>
                  {getFieldDecorator(`filterexpression[${k - 1}]`, {
                    rules: [
                      {
                        required: true,
                        message: 'Please select a filter expression!',
                      },
                    ],
                  })(
                    <Select
                      // style={{ width: '30%', margin: '10px 10px' }}
                      placeholder="Select a filter expression"
                      onBlur={this.onBlur}
                      onChange={this.filterExpressionSelected}
                    >
                      {filterExpression}
                      {/* {filterExpression.length === 0
                        ? null
                        : criterionObj.filterfield[0].filterExpressions.map(item => (
                          //  eslint-disable-next-line
                          <Select.Option onBlur={this.onBlur} key={item.id} value={item.id}>
                            {item.value}
                          </Select.Option>
                        ))} */}
                    </Select>,
                  )}
                </Form.Item>
              )}
            </Col>
            <Col span={8}>
              {this.state.value === 'number' ? (
                <Form.Item>
                  {getFieldDecorator(`amount[${k - 1}]`, {
                    rules: [
                      {
                        required: true,
                        message: 'Please input amount!',
                      },
                      {
                        pattern: '^([0-9]|[1-9][0-9]|[1-9][0-9][0-9])$',
                        message: 'Input is invalid. Please input 0-999. Try an exactly number!',
                      },
                    ],
                  })(
                    <Input
                      onBlur={this.onBlur}
                      type="number"
                      placeholder="amount"
                      // formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      min={0}
                      maxLength={4}
                    />,
                  )}
                </Form.Item>
              ) : null}
            </Col>
            <Col span={8}>
              {this.state.value === 'spent' ? (
                <Form.Item>
                  {getFieldDecorator(`amount[${k - 1}]`, {
                    rules: [
                      {
                        required: true,
                        message: 'Please input spent!',
                      },
                    ],
                    initialValue: 1,
                  })(
                    <InputNumber
                      // defaultValue={1000}
                      min={1}
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      onChange={this.onChange}
                    />,
                  )}
                </Form.Item>
              ) : null}
            </Col>
            <Col span={8}>
              {this.state.value === 'string' ? (
                <Form.Item>
                  {getFieldDecorator(`amount[${k - 1}]`, {
                    rules: [
                      {
                        required: true,
                        message: 'Please input information!',
                      },
                    ],
                  })(
                    <Input
                      onBlur={this.onBlur}
                      type="string"
                      // placeholder="value"
                      // min={0}
                      // maxLength={4}
                    />,
                  )}
                </Form.Item>
              ) : null}
            </Col>
            <Col span={8}>
              {this.state.value === 'date' ? (
                <Form.Item>
                  {getFieldDecorator(`amount[${k - 1}]`, {
                    rules: [
                      {
                        required: true,
                        message: 'Please input total joined days!',
                      },
                      {
                        pattern: '^([0-9]|[1-9][0-9]|[1-9][0-9][0-9]|[1-9][0-9][0-9][0-9])$',
                        message:
                          'Input is invalid. Please input 0-9999. Try an exactly joined days number!',
                      },
                    ],
                  })(
                    <Col span={20}>
                      <Input
                        onBlur={this.onBlur}
                        type="number"
                        // placeholder="value"
                        // min={0}
                        // maxLength={4}
                      />
                    </Col>,
                  )}
                  <Col span={4}>
                    <span style={{ float: 'left', marginLeft: 5 }}> days</span>
                  </Col>
                </Form.Item>
              ) : null}
            </Col>
          </Row>
        </div>
      )
    }
  },
)

function onFocus() {
  console.log('focus')
}

@connect(({ criterionType }) => ({ criterionType }))
@Form.create()
class CreateAudience extends React.Component {
  constructor(props) {
    super(props)
    this.selected = this.selected.bind(this)
  }

  componentDidMount = () => {
    const { dispatch } = this.props
    dispatch({ type: 'criterion/GET_AUDIENCE_DEFINITION' })
  }

  remove = k => {
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    // We need at least one passenger
    if (keys.length === 0) {
      return
    }

    const nextKeys = keys.concat((id -= 1))
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
      // keys: nextKeys
    })
  }

  add = e => {
    console.log(e)
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    const nextKeys = keys.concat((id += 1))
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    })
  }

  handleSubmit = e => {
    const { dispatch } = this.props
    //  eslint-disable-next-line
    const { criterionTypes } = this.props.criterionType
    // const { filterCriterion } = this.state
    e.preventDefault()
    //  eslint-disable-next-line
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        localStorage.removeItem('audienceDetail')
        // const { keys, criterion } = values
        console.log('Received values of form: ', values)
        // console.log('Merged values:', keys.map(key => criterion[key - 1]))

        // criterions.forEach(criterionObj => {
        // if (criterionTypes.name === e) {
        //   this.setState({ criterionObj: criterionTypes })
        // }
        dispatch({
          type: 'audience/CREATE_A_AUDIENCE',
          payload: values,
        })
        //  eslint-disable-next-line
        this.props.history.push('../audiences/detail')
      }
    })
  }

  handleChange = e => {
    console.log(e.target)
  }

  selected = e => {
    //  eslint-disable-next-line
    const { criterionTypes } = this.props.criterionType
    console.log(e)
    //  eslint-disable-next-line
    // criterionTypes.forEach(item => {
    if (criterionTypes.id === e) {
      this.setState({ criterionObj: criterionTypes })
    }
    // })
  }

  render() {
    // eslint-disable-next-line
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { criterionType } = this.props
    const { criterionTypes, definition } = criterionType

    getFieldDecorator('keys', { initialValue: [] })
    const keys = getFieldValue('keys')
    const formItems = keys.map(k => (
      <div>
        <SelectNewsletterForm
          k={k}
          criterionTypes={criterionTypes}
          // criterionObj={criterionObj}
          getFieldDecorator={getFieldDecorator}
          getFieldValue={getFieldValue}
          keys={keys}
          definition={definition}
        />
        <Form.Item key={k - 1}>
          {keys.length > 0 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(k)}
            />
          ) : null}
        </Form.Item>
        <Form.Item key={k - 1}>
          {keys.length >= 1 + k ? (
            <div>
              <Divider type="vertical" /> <br />
              OR
              <br />
              <Divider type="vertical" />
            </div>
          ) : null}
        </Form.Item>
      </div>

      // here
    ))
    return (
      <Form onSubmit={this.handleSubmit} onChange={this.handleChange}>
        <div>
          <Row style={{ marginBottom: 15 }}>
            <Col style={{ float: 'right' }}>
              {/* </Link> */}
              <Link to="./">
                <Button type="default">Cancel</Button>
              </Link>
              {/* <Link to=""> */}
              <Button type="primary" htmlType="submit">
                Create
              </Button>
            </Col>
          </Row>
        </div>
        <div className={styles.border} style={{ padding: 15 }}>
          {/* <h5 style={{ fontWeight: 'bold', margin: '3px' }}>Name</h5> */}
          <div className={styles.top}>
            <Form.Item label="Audience name">
              {getFieldDecorator('audienceName', {
                rules: [
                  {
                    required: true,
                    message: 'Please input audience name!',
                  },
                ],
              })(<Input onBlur={this.onBlur} placeholder="Audience Name" />)}
            </Form.Item>
            <span className={styles.txtDesctiption}>
              * Now you can generate personalized messages based on user behavior
            </span>
          </div>

          <div className={styles.body}>
            <h5 style={{ fontWeight: 'bold' }}>Definition</h5>
            {formItems}
            <Form.Item className={styles.formItem}>
              <Button type="dashed" onClick={this.add} className={styles.btnAdd}>
                +
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    )
  }
}
export default CreateAudience
