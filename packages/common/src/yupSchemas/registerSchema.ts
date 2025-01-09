import * as yup from 'yup'

export const validUserSchema = yup.object().shape({
	email: yup
		.string()
		.min(5, 'email cannot be shorter than 5 characters')
		.max(255)
		.email('invalid email format')
		.required(),
	password: yup
		.string()
		.min(5, 'password cannot be shorter than 5 characters')
		.max(255)
		.required(),
})
