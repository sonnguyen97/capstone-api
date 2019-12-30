import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Row, Input, Form, Icon, Select } from 'antd'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'

let id = 0
// const value = 0
// function onBlur() {
//   console.log('blur')
// }

function onFocus() {
  console.log('focus')
}

@connect(({ criterionType }) => ({ criterionType }))
@Form.create()
class EditAudience extends React.Component {
  constructor(props) {
    super(props)
    this.selected = this.selected.bind(this)
  }

  state = {
    criterionObj: {},
  }

  componentDidMount = () => {
    const { dispatch } = this.props
    dispatch({ type: 'criterion/GET_CRITERION_TYPE' })
  }

  remove = k => {
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue('keys')
    // We need at least one passenger
    if (keys.length === 0) {
      return
    }
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
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
    e.preventDefault()
    //  eslint-disable-next-line
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        dispatch({
          type: 'audience/CREATE_A_AUDIENCE',
          payload: values,
        })
      }
      //  eslint-disable-next-line
      this.props.history.push('../audiences')
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
    if (criterionTypes.id === e) {
      this.setState({ criterionObj: criterionTypes })
    }
  }

  render() {
    // eslint-disable-next-line
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { criterionType } = this.props
    const { criterionTypes } = criterionType
    const { criterionObj } = this.state

    getFieldDecorator('keys', { initialValue: [] })
    const keys = getFieldValue('keys')
    const formItems = keys.map(k => (
      <div className={styles.formFilter} key={k - 1}>
        <Form.Item label="Criterion Type">
          {getFieldDecorator(`criterionType[${k - 1}]`, {
            rules: [
              {
                required: true,
                message: 'Please input criterion this field',
              },
            ],
          })(
            <Select
              placeholder="Select a criterion"
              optionFilterProp="children"
              onFocus={onFocus}
              onBlur={this.onBlur}
              onChange={this.selected}
            >
              {!criterionTypes ? null : (
                //  eslint-disable-next-line
                <Select.Option value={criterionTypes.id} key={criterionTypes.id}>
                  {criterionTypes.name}
                </Select.Option>
              )}
            </Select>,
          )}
        </Form.Item>
        <Row gutter={24}>
          <Col span={8}>
            {!criterionObj.filterfield ? null : (
              <Form.Item type="hidden" label="Filter field">
                {getFieldDecorator(`filterfield[${k - 1}]`, {
                  rules: [
                    {
                      required: true,
                      message: 'Please input filter field this field',
                    },
                  ],
                })(
                  <Select placeholder="Select filter">
                    {!criterionObj.filterfield
                      ? null
                      : criterionObj.filterfield.map(item => (
                          //  eslint-disable-next-line
                          <Select.Option key={item.id} value={item.id}>
                            {item.name}
                          </Select.Option>
                        ))}
                  </Select>,
                )}
              </Form.Item>
            )}
          </Col>
          <Col span={8}>
            {!criterionObj.filterfield ? null : (
              <Form.Item label="Filter expression">
                {getFieldDecorator(`filterexpression[${k - 1}]`, {
                  rules: [
                    {
                      required: true,
                      message: 'Please input filter expression this field',
                    },
                  ],
                })(
                  <Select placeholder="Select a filter expression" onBlur={this.onBlur}>
                    {!criterionObj.filterfield
                      ? null
                      : criterionObj.filterfield[0].filterExpressions.map(item => (
                          //  eslint-disable-next-line
                          <Select.Option onBlur={this.onBlur} key={item.id} value={item.id}>
                            {item.value}
                          </Select.Option>
                        ))}
                  </Select>,
                )}
              </Form.Item>
            )}
          </Col>
          <Col span={8}>
            {!criterionObj.filterfield ? null : (
              <Form.Item label="Amount">
                {getFieldDecorator(`amount[${k - 1}]`, {
                  rules: [
                    {
                      required: true,
                      message: 'Please input amount this field',
                    },
                  ],
                })(
                  <Input
                    onBlur={this.onBlur}
                    type="number"
                    placeholder="Input a number"
                    min={0}
                    maxLength={4}
                  />,
                )}
              </Form.Item>
            )}
          </Col>
        </Row>
        <Form.Item key={k - 1}>
          {keys.length > 0 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(k)}
            />
          ) : null}
        </Form.Item>
      </div>
    ))
    return (
      <Form onSubmit={this.handleSubmit} onChange={this.handleChange}>
        <div className={styles.border}>
          <div className={styles.top}>
            <Form.Item label="Audience name">
              {getFieldDecorator('audienceName', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your audience name',
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
                AND
              </Button>
            </Form.Item>
          </div>
        </div>
        <div className={styles.bottom}>
          <Row className={styles.btnPreview}>
            <Col style={{ float: 'right' }}>
              <Button type="primary" htmlType="submit">
                Create
              </Button>
              <Link to="./">
                <Button type="default">Cancel</Button>
              </Link>
            </Col>
          </Row>
        </div>
      </Form>
    )
  }
}
export default EditAudience
