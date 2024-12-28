import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Flex } from 'antd'
import { FormikErrors, FormikProps, withFormik } from 'formik'

interface FormValues {
	email: string
	username: string
	password: string
}
interface Props {
	submit: (values: FormValues) => Promise<FormikErrors<FormValues>>
}
const C: React.FC<FormikProps<FormValues> & Props> = () => {
	return (
		<div style={{ alignItems: 'center' }}>
			<div style={{ maxWidth: 400, margin: 'auto' }}>
				<Form.Item
					name='username'
					rules={[{ required: true, message: 'Please input your Username!' }]}
				>
					<Input prefix={<UserOutlined />} placeholder='Username' />
				</Form.Item>
				<Form.Item
					name='email'
					rules={[{ required: true, message: 'Please input your Email!' }]}
				>
					<Input prefix={<UserOutlined />} placeholder='Username' />
				</Form.Item>
				<Form.Item
					name='password'
					rules={[{ required: true, message: 'Please input your Password!' }]}
				>
					<Input
						prefix={<LockOutlined />}
						type='password'
						placeholder='Password'
					/>
				</Form.Item>
				<Form.Item>
					<Flex justify='space-between' align='center'>
						<Form.Item name='remember' valuePropName='checked' noStyle>
							<Checkbox>Remember me</Checkbox>
						</Form.Item>
						<a href=''>Forgot password</a>
					</Flex>
				</Form.Item>

				<Form.Item>
					<Button block type='primary' htmlType='submit'>
						Register
					</Button>
					or <a href=''>Login now!</a>
				</Form.Item>
			</div>
		</div>
	)
}

export const RegisterView = withFormik<Props, FormValues>({
	mapPropsToValues: () => ({ email: '', username: '', password: '' }),
	handleSubmit: async (values, { props, setErrors, setSubmitting }) => {
		const errors = await props.submit(values)
	},
})(C)
