/* eslint-disable */
import React, { createRef } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import Editor from 'react-email-editor'
import {
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
  Spin,
  message,
} from 'antd'

import sample from './example/sample.json'
import Validator from 'validator'

const { confirm } = Modal
const EmailEditor = Editor

/* --------------------------------------------------------------- */
// GET REDIRECT URL FORM

const GetRedirectUrlForm = Form.create({ name: 'get_redirect_url_form' })(
  class extends React.Component {
    render() {
      const { width, handleOnClick, inputOnChange, form, initialValue } = this.props
      const { getFieldDecorator } = form
      return (
        <Form layout="inline">
          <Form.Item label="Redirect URL">
            {getFieldDecorator('url', {
              initialValue: initialValue,
              rules: [{ required: true, message: 'Please input the url' }],
            })(<Input style={{ width: !width ? 300 : width }} onChange={inputOnChange} />)}
            <Button style={{ marginLeft: 10, marginTop: 4 }} onClick={handleOnClick} type="primary">
              Validate
            </Button>
          </Form.Item>
        </Form>
      )
    }
  },
)
// GET REDIRECT URL FORM - END

/* --------------------------------------------------------------- */

// NEWSLETTER CREATE FORM

const CreateEmailTemplateForm = Form.create({ name: 'save_email_template_in_modal' })(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props
      const { getFieldDecorator } = form
      return (
        <Modal
          visible={visible}
          title="Create Email Template"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Email Template Name">
              {getFieldDecorator('emailTemplateName', {
                rules: [{ required: true, message: 'Please input the email template name' }],
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
@connect(({ emailTemplate }) => ({ emailTemplate }))
class EmailContentDesignPage extends React.Component {
  state = {
    onLoadContent: sample,
    createEmailTemplateFormVisibility: false,
    isSave: false,
    loading: false,
    isValidatedUrl: false,
  }

  componentDidMount = () => {
    console.log('EMAIL_CONTENT_PAGE componentDidMount PROPS', this.props)
  }

  componentWillReceiveProps(nextProps) {
    console.log('EMAIL_CONTENT_PAGE componentWillReceiveProps PROPS', nextProps)
    // this.setState({ nextProps })
  }

  /* --------------------------------------------------------------- */

  // PAGE HEADER HANDLING FUNCTIONS
  saveCreateEmailTemplateFormRef = formRef => {
    this.createEmailTemplateFormRef = formRef
  }

  openCreateEmailTemplateForm = () => {
    console.log('handling Save Content as Template ...')
    this.setState({ createEmailTemplateFormVisibility: true })
  }

  // Create Email Template form handling
  createEmailTemplateOnCancel = () => {
    this.setState({ createEmailTemplateFormVisibility: false })
  }

  createEmailTemplateOnCreate = () => {
    window.unlayer.exportHtml(data => {
      const { form } = this.createEmailTemplateFormRef.props
      const { dispatch } = this.props

      form.validateFields((err, values) => {
        if (err) {
          return
        }
        console.log('EmailTemplateName: ', values)

        let emailTemplate = {
          name: null,
          htmlContent: null,
          designContent: null,
        }

        emailTemplate.name = values.emailTemplateName

        const { design, html } = data
        emailTemplate.htmlContent = html
        emailTemplate.designContent = JSON.stringify(design)

        // localStorage.setItem('emailTemplate', JSON.stringify(emailTemplate))

        console.log('emailTemplate', emailTemplate)
        dispatch({
          type: 'emailTemplate/CREATE_EMAIL_TEMPLATE',
          payload: emailTemplate,
        })

        this.setState({ createEmailTemplateFormVisibility: false })
      })
    })
  }

  openViewInstructionModal = () => {
    Modal.info({
      title: <h5>Tracking Clicked Component Feature</h5>,
      content: (
        <Row type="flex" justify="center">
          <Col span={24}>
            <div className="card" style={{ marginLeft: -20, paddingTop: 10, paddingLeft: 10 }}>
              <p>
                <span style={{ fontWeight: 'bold', marginRight: 5 }}>Step 1:</span>Select the button
                that you want to track by clicking on the button
              </p>
              <p>
                <span style={{ fontWeight: 'bold', marginRight: 5 }}>Step 2:</span>At the field URL
                in the right panel, input{' '}
                <span style={{ fontFamily: 'Consolas', backgroundColor: 'yellow' }}>
                  /emm-clicked-email-tracking
                </span>
              </p>
              <p>
                <span style={{ fontWeight: 'bold', marginRight: 5 }}>Step 3:</span>Input the URL
                that you want us to redirect to in the <b>'Redirected URL'</b> field
              </p>
              <p>
                <span style={{ fontWeight: 'bold', marginRight: 5 }}>*Notice:</span>Redirect URL
                field only appears when you allows us to handle tracking clicked method
              </p>
            </div>

            <p style={{ fontStyle: 'italic' }}>
              ***We currently support for tracking ONE component
            </p>
          </Col>
        </Row>
      ),
      onOk() {},
      width: 500,
    })
  }

  // PAGE HEADER HANDLING FUNCTIONS -- END

  /* --------------------------------------------------------------- */

  // PAGE BODY HANDLING FUNCTIONS

  onLoad = () => {
    // this.editor.addEventListener('onDesignLoad', this.onDesignLoad)
    // this.setState({ loading: true })

    let design = null
    const currNewsletter = !localStorage.getItem('currNewsletter')
      ? null
      : JSON.parse(localStorage.getItem('currNewsletter'))
    const email = !currNewsletter ? null : currNewsletter.email

    if (currNewsletter) {
      if (email.rawContent !== '') {
        design = JSON.parse(email.rawContent)
        // this.state.onLoadContent = design
        message.success({
          content: 'Loaded email content successfully',
        })
      }
      // else {
      //   design = sample
      //   notification.warning({
      //     message: 'Your email content is empty. Default template is loaded instead',
      //   })
      // }
    }
    // else {
    //   design = sample
    //   notification.warning({
    //     message: 'Cannot load you email content. Default template is loaded instead',
    //   })
    // }
    window.unlayer.loadDesign(design)

    // this.setState({ loading: false })
  }

  handleSaveContent = () => {
    window.unlayer.exportHtml(data => {
      // eslint-disable-next-line
      const { design, html } = data
      // console.log('html', html)
      // console.log('design', design)

      const currNewsletter = !localStorage.getItem('currNewsletter')
        ? null
        : JSON.parse(localStorage.getItem('currNewsletter'))

      notification.info({
        message: 'Email Design is saving ...',
      })

      currNewsletter.email.htmlContent = html
      currNewsletter.email.rawContent = JSON.stringify(design)

      console.log('EMAIL DESIGN currNewsletter', currNewsletter)

      localStorage.setItem('currNewsletter', JSON.stringify(currNewsletter))
      localStorage.setItem('emailContentSaved', true)
      this.setState({ isSave: true })

      setTimeout(() => {
        this.handleGoBack()
      }, 1000)
    })
  }

  handleGoBack = async () => {
    const { isSave } = this.state
    const handleSaveContent = this.handleSaveContent

    const urlForm = !this.getRedirectUrlFormRef ? undefined : this.getRedirectUrlFormRef.props.form
    if (urlForm) {
      let isValidated = await urlForm
        .validateFields()
        .then(values => {
          return true
        })
        .catch(error => {
          return false
        })
      console.log('isEMpty', isValidated)
      if (isValidated === false || this.state.isValidatedUrl === false) {
        notification.warning({
          message: 'Please input URL and validate before going back',
        })
        return
      }
    }

    if (!isSave) {
      confirm({
        title: `Go Back?`,
        content: `You have not save your email design. Do you want to save?`,
        cancelText: 'No',
        okText: 'Yes',
        onOk() {
          console.log(`Save`)
          handleSaveContent()
        },
        onCancel() {
          console.log(`Cancel`)
          localStorage.setItem('emailContentSaved', false)
          setTimeout(() => {
            window.history.back()
          }, 1000)
        },
      })
    } else {
      console.log('Already saved email. Going back ...')
      setTimeout(() => {
        window.history.back()
        notification.success({
          message: 'Email Design is saved',
        })
      }, 1000)
    }
  }

  onDesignLoad = data => {
    // this.onLoad()
    // console.log('onDesignLoad', data)
  }

  validateUrl = async () => {
    const { form } = this.getRedirectUrlFormRef.props

    let isValidated = await form
      .validateFields()
      .then(values => {
        const { url } = values
        let isURL = Validator.isURL(url)
        console.log('URL validation', isURL)

        const currNewsletter = !localStorage.getItem('currNewsletter')
          ? null
          : JSON.parse(localStorage.getItem('currNewsletter'))

        if (isURL === false) {
          notification.warning({
            message: 'Invalid URL!',
          })
          return false
        }

        currNewsletter.trackingUrl = url

        localStorage.setItem('currNewsletter', JSON.stringify(currNewsletter))
        notification.success({
          message: 'URL is valid!',
        })
        return true
      })
      .catch(error => {
        return false
      })
    console.log('isValidated', isValidated)

    if (isValidated) {
      this.setState({ isValidatedUrl: isValidated })
    }
  }

  urlInputOnChange = event => {
    console.log('URL onChange')
    this.setState({ isValidatedUrl: false })
  }

  // PAGE BODY HANDLING FUNCTIONS -- END

  /* --------------------------------------------------------------- */

  // MAIN RENDERING
  render() {
    const { loading } = this.state
    const currEditor = !this.editor ? null : this.editor
    const currNewsletter = !localStorage.getItem('currNewsletter')
      ? null
      : JSON.parse(localStorage.getItem('currNewsletter'))

    let urlInputVisibility = !currNewsletter
      ? false
      : currNewsletter.trackingConfig.isCheckingClickedUrl

    let trackingUrl = !currNewsletter ? '' : currNewsletter.trackingUrl

    return (
      <section className="card">
        <Helmet title="Email Content Design" />
        {/* <Spin spinning={loading}> */}
        <Row type="flex" justify="start">
          <Col span={14}>
            <Row type="flex" justify="start" style={{ paddingTop: 20, paddingLeft: 20 }}>
              <h1>Email Content Design</h1>
            </Row>
          </Col>
          <Col span={10} style={{ paddingTop: 20 }}>
            <Row type="flex" justify="end" style={{ paddingRight: 20 }}>
              <Button
                style={{ marginRight: 20 }}
                type="link"
                size="large"
                onClick={this.handleGoBack}
              >
                Back
              </Button>
              {/* <Button
                style={{ marginRight: 20 }}
                type="primary"
                size="large"
                onClick={this.openCreateEmailTemplateForm}
              >
                Save as Template
              </Button> */}
              <Button
                style={{ marginRight: 20 }}
                type="link"
                size="large"
                onClick={this.openViewInstructionModal}
              >
                View Instruction
              </Button>
              <CreateEmailTemplateForm
                wrappedComponentRef={this.saveCreateEmailTemplateFormRef}
                visible={this.state.createEmailTemplateFormVisibility}
                onCancel={this.createEmailTemplateOnCancel}
                onCreate={this.createEmailTemplateOnCreate}
              />
              <Button type="primary" size="large" onClick={this.handleSaveContent}>
                Save &amp; Back
              </Button>
            </Row>
          </Col>
        </Row>

        {urlInputVisibility === true ? (
          <Row type="flex" justify="center">
            <Col>
              <GetRedirectUrlForm
                wrappedComponentRef={formRef => {
                  createRef((this.getRedirectUrlFormRef = formRef))
                }}
                handleOnClick={this.validateUrl}
                inputOnChange={this.urlInputOnChange}
                width={350}
                initialValue={trackingUrl}
              />
            </Col>
          </Row>
        ) : (
          undefined
        )}

        <Divider type="horizontal" />
        <Row type="flex" justify="center" style={{ overflowX: 'scroll' }}>
          <EmailEditor
            // ref={editor => (this.editor = window.unlayer)}
            onLoad={this.onLoad}
            // onDesignLoad={this.onDesignLoad}
            minHeight={725}
            style={{ width: 100 }}
          />
        </Row>
        {/* </Spin> */}
      </section>
    )
  }
}

export default EmailContentDesignPage
