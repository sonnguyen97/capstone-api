import React from 'react'
import { Helmet } from 'react-helmet'
import { Empty, Button } from 'antd'

class NewsletterStartPage extends React.Component {
  render() {
    return (
      <div>
        <Helmet title="Newsletter" />
        <Empty
          image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
          imageStyle={{
            height: 60,
          }}
          description={
            <div>
              <h1>No newsletter yet?</h1>
              <span>Create newsletter help you send emails to your audience quickly</span>
            </div>
          }
        >
          <Button type="primary" size="large">
            Create Newsletter
          </Button>
        </Empty>
      </div>
    )
  }
}

export default NewsletterStartPage
