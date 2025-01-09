import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Flex } from 'antd'
import { FormikErrors, FormikProps, withFormik, Field } from 'formik'
import { validUserSchema } from '@cf/common'
import { InputField } from '../../shared/InputField'

interface FormValues {
	email: string
	password: string
}
interface Props {
	submit: (values: FormValues) => Promise<FormikErrors<FormValues> | null>
}
const RegisterForm: React.FC<FormikProps<FormValues> & Props> = ({
	handleSubmit,
}) => {
	return (
		<form style={{ alignItems: 'center' }} onSubmit={handleSubmit}>
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
		</form>
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
