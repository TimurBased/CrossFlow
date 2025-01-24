import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Flex } from 'antd'
import { FormikErrors, FormikProps, withFormik, Field } from 'formik'
import { validUserSchema } from '@crossflow/common'
import { InputField } from '../../../shared/InputField'
import { Link } from 'react-router-dom'

interface FormValues {
	email: string
	password: string
}
interface Props {
	submit: (values: FormValues) => Promise<FormikErrors<FormValues> | null>
	isLoading: boolean
	error: string | null
}
const RegisterForm: React.FC<FormikProps<FormValues> & Props> = ({
	handleSubmit,
	isLoading,
	error,
}) => {
	return (
		<Form style={{ display: 'flex' }} onFinish={handleSubmit}>
			<div style={{ maxWidth: 400, margin: 'auto' }}>
				<Field
					name='email'
					prefix={<UserOutlined />}
					placeholder='Email'
					component={InputField}
				/>
				<Field
					name='password'
					type='password'
					prefix={<LockOutlined />}
					placeholder='Password'
					component={InputField}
				/>
				<Form.Item>
					<Flex justify='space-between' align='center'>
						<Form.Item name='remember' valuePropName='checked' noStyle>
							<Checkbox>Remember me</Checkbox>
						</Form.Item>
						<Link to='/forgot-password'>Forgot password</Link>
					</Flex>
				</Form.Item>
				<Form.Item>
					<Button block type='primary' htmlType='submit'>
						Register
					</Button>
					or <Link to='/login'>Login now!</Link>
				</Form.Item>
			</div>
		</Form>
	)
}

export const RegisterView = withFormik<Props, FormValues>({
	validationSchema: validUserSchema,
	mapPropsToValues: () => ({ email: '', password: '' }),
	handleSubmit: async (values, { props, setErrors }) => {
		const errors = await props.submit(values)
		if (errors) {
			setErrors(errors)
		}
	},
})(RegisterForm)
