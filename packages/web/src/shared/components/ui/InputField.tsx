import React from 'react'
import { FieldProps } from 'formik'
import { Form, Input } from 'antd'

export const InputField: React.FC<FieldProps<any> & {}> = ({
	field, // { name, value, onChange, onBlur }
	form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
	...props
}) => {
	const ErrorMessage = (touched[field.name] &&
		errors[field.name]) as React.ReactNode
	return (
		<Form.Item help={ErrorMessage} validateStatus={ErrorMessage ? 'error' : ''}>
			<Input {...field} {...props} />
		</Form.Item>
	)
}
