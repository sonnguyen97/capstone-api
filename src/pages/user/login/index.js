import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './style.module.scss'

@Form.create()
@connect(({ user }) => ({ user }))
class Login extends Component {
  onSubmit = event => {
    event.preventDefault()
    // const params = new URLSearchParams(window.location.search)
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: 'user/LOGIN',
          payload: values,
        })
      }
    })
  }

  render() {
    const {
      form,
      user: { fetching },
    } = this.props
    return (
      <div>
        <Helmet title="Login" />
        <div className={`${styles.title} login-heading`}>
          <h1>
            <strong>Email Marketing Management for Shopify</strong>
          </h1>
        </div>
        <div className="container">
          <table>
            <thead>
              <tr>
                <th>
                  <div className={styles.inner}>
                    <div className={styles.form}>
                      <h4 className="text-uppercase">
                        <strong>Please log in</strong>
                      </h4>
                      <br />
                      <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit}>
                        <Form.Item label="Store domain">
                          {form.getFieldDecorator('storeDomain', {
                            // initialValue: 'admin@mediatec.org',
                            rules: [{ required: true, message: 'Please input your store domain' }],
                          })(<Input size="default" placeholder="mydomain.myshopify.com" />)}
                        </Form.Item>
                        <Form.Item label="Password">
                          {form.getFieldDecorator('password', {
                            // initialValue: 'cleanui',
                            rules: [{ required: true, message: 'Please input your password' }],
                          })(<Input size="default" type="password" />)}
                        </Form.Item>
                        <Form.Item>
                          {form.getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                          })(<div>.</div>)}
                          <Link
                            to="/user/forgot"
                            className="utils__link--blue utils__link--underlined pull-right"
                          >
                            {/* Forgot password? */}
                          </Link>
                        </Form.Item>
                        <div className="form-actions">
                          <Button
                            type="primary"
                            className="width-150 mr-4"
                            htmlType="submit"
                            loading={fetching}
                          >
                            Login
                          </Button>
                          <span className="ml-3 register-link">
                            <a
                              // href="javascript: void(0);"
                              className="text-primary utils__link--underlined"
                            >
                              {/* Register */}
                            </a>{' '}
                            Welcome to EMM application
                          </span>
                        </div>
                      </Form>
                    </div>
                  </div>
                </th>
                <th>
                  <div className={styles.sidebar}>
                    <p className={styles.sidebarTitle}>Email Marketing Solution</p>
                    <p className={styles.sidebarSubTitle}>September 2019</p>
                    <div className={styles.sidebarContent}>
                      <p>Show solution for email marketing</p>
                    </div>
                    <div className={styles.sidebarFooter}>
                      <span>
                        <i className="icmn-location mr-3" />
                        HCM, VN
                      </span>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    )
  }
}

export default Login
