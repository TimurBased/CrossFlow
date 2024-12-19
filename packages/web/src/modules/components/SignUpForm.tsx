import React from 'react'
import Input from './UI/Input'
import Button from './UI/Button'

const SignUpForm = () => {
	const [signUpData, setSignUpData] = React.useState({
		username: '',
		password: '',
		email: '',
	})
	const signUpHandler = (e: any) => {
		e.preventDefault()
		console.log(signUpData)
		setSignUpData({ username: '', password: '', email: '' })
	}
	return (
		<>
			<form>
				<h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign Up</h1>
				<Input
					type='text'
					onChange={(e: any) =>
						setSignUpData(prev => ({ ...prev, username: e.target.value }))
					}
					placeholder='Username'
					required
				/>

				<Input
					type='email'
					onChange={(e: any) =>
						setSignUpData(prev => ({ ...prev, email: e.target.value }))
					}
					placeholder='Email'
					required
				/>

				<Input
					type='password'
					onChange={(e: any) =>
						setSignUpData(prev => ({ ...prev, password: e.target.value }))
					}
					placeholder='Password'
					required
				/>

				<Button style={{ marginRight: '10px' }} onClick={signUpHandler}>
					Continue
				</Button>
				<Button>Cancel</Button>
			</form>
		</>
	)
}

export default SignUpForm
