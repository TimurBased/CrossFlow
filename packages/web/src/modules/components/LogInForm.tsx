import React from 'react'
import Input from './UI/Input'
import Button from './UI/Button'

const LogInForm = () => {
	const [logInData, setlogInData] = React.useState({
		username: '',
		password: '',
	})
	const logInHandler = (e: any) => {
		e.preventDefault()
		console.log(logInData)
		setlogInData({ username: '', password: '' })
	}
	return (
		<>
			<form>
				<h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Log In</h1>
				<Input
					type='text'
					onChange={(e: any) =>
						setlogInData(prev => ({ ...prev, username: e.target.value }))
					}
					placeholder='Username'
					required
				/>
				<Input
					type='password'
					onChange={(e: any) =>
						setlogInData(prev => ({ ...prev, password: e.target.value }))
					}
					placeholder='Password'
					required
				/>

				<Button style={{ marginRight: '10px' }} onClick={logInHandler}>
					Continue
				</Button>
				<Button>Cancel</Button>
			</form>
		</>
	)
}

export default LogInForm
