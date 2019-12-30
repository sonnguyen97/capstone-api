import React from 'react'
import { Form, Input, Icon, Checkbox, Button } from 'antd'

const FormItem = Form.Item

class RegisterFormComponent extends React.Component {
  state = {
    confirmDirty: false,
  }

  handleConfirmBlur = e => {
    const { value } = e.target
    const { confirmDirty } = this.state
    this.setState({
      confirmDirty: confirmDirty || !!value,
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    // const { form } = this.props
    // form.validateFields((err, values) => {
    // })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!')
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props
    const { confirmDirty } = this.state
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  render() {
    const { form } = this.props
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem validateStatus="validating">
          {form.getFieldDecorator('UserName', {
            rules: [{ required: true, message: 'Please input your Username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </FormItem>
        <FormItem validateStatus="validating">
          {form.getFieldDecorator('CompanyName', {
            rules: [{ required: true, message: 'Please input your Company Name!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="CompanyName"
            />,
          )}
        </FormItem>
        <FormItem validateStatus="validating">
          {form.getFieldDecorator('Email', {
            rules: [{ required: true, message: 'Please input your Email!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email Adderss"
            />,
          )}
        </FormItem>
        <FormItem validateStatus="validating">
          {form.getFieldDecorator('Phone', {
            rules: [{ required: true, message: 'Phone!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Phone"
            />,
          )}
        </FormItem>
        <FormItem validateStatus="validating">
          {form.getFieldDecorator('Country', {
            rules: [{ required: true, message: 'Your Country!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Country"
            />,
          )}
        </FormItem>

        <FormItem>
          {form.getFieldDecorator('password', {
            rules: [
              {
                required: true,
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Input your password"
            />,
          )}
        </FormItem>
        <FormItem>
          {form.getFieldDecorator('confirm', {
            rules: [
              {
                required: true,
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(
            <Input
              type="password"
              onBlur={this.handleConfirmBlur}
              placeholder="Confirm your password"
            />,
          )}
        </FormItem>
        <FormItem validateStatus="validating">
          {form.getFieldDecorator('Contact', {
            rules: [{ required: true, message: 'How many contact do you have?' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Contact"
            />,
          )}
        </FormItem>
        <FormItem validateStatus="validating">
          {form.getFieldDecorator('URL', {
            rules: [{ required: true, message: 'Company URL?' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="URL"
            />,
          )}
        </FormItem>
        {form.getFieldDecorator('receiveremail', {
          valuePropName: 'checked',
          initialValue: true,
        })(<Checkbox>Klaviyo has a newsletter? Sign me up!</Checkbox>)}
        <br />
        {form.getFieldDecorator('walkthough', {
          valuePropName: 'checked',
          initialValue: true,
        })(<Checkbox>I would like a walkthrough / consultation.</Checkbox>)}

        <div className="form-actions">
          <Button type="primary" htmlType="submit" className="login-form-button">
            Sign Up
          </Button>
        </div>
      </Form>
    )
  }
}

const RegisterForm = Form.create()(RegisterFormComponent)
export default RegisterForm
