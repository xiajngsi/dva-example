import React from 'react'
import { connect } from 'dva'
import { Form, Input, Button } from 'antd'
import './IndexPage.scss'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
}
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
}
class IndexPage extends React.Component {
  state = {
    checkNick: false,
  };
  check = () => {
    this.props.form.validateFields(
      (err, values) => {
        if (err) {
          return
        }
        console.log('this.props', this.props)
        this.props.login(values)
        console.log('values', values)
      },
    )
  }
  handleChange = (e) => {
    this.setState({
      checkNick: e.target.checked,
    }, () => {
      this.props.form.validateFields(['nickname'], { force: true })
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <FormItem {...formItemLayout} label='手机号码'>
          {getFieldDecorator('mobile', {
            rules: [{
              pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\d{8}$/,
              required: true,
              message: '请输入手机号',
            }],
          })(
            <Input placeholder='请输入手机号' />,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label='密码'>
          {getFieldDecorator('password', {
            rules: [{
              required: true,
              message: '密码由数字、字母组成',
            }],
          })(
            <Input placeholder='请输入密码' />,
          )}
        </FormItem>
        <FormItem {...formTailLayout}>
          <Button type='primary' onClick={this.check}>
            登录
          </Button>
        </FormItem>
      </div>
    )
  }
}

const mapStateToProps = () => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (query) => {
      console.log('query', query)
      return dispatch({ type: 'example/login', payload: { query } })
    },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(IndexPage))
