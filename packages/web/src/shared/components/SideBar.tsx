import React from 'react'
import styled from 'styled-components'
import { Button } from 'antd'
import logo from '../assets/DummyLogo.jpg'

const StyledImg = styled.img`
	width: 100px;
`
const StyledWrapper = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	width: 250px;
	background-color: #f8f9fa;
	padding: 20px;
	box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`

const StyledButton = styled(Button)`
	margin-bottom: 10px;
	a {
		color: inherit;
		text-decoration: none;
	}
`

export const SideBar: React.FC = () => {
	return (
		<StyledWrapper>
			<StyledImg src={logo} alt='Logo' style={{ marginBottom: 20 }} />
			<StyledButton
				style={{ textDecoration: 'none' }}
				color='purple' //НЕ РАБОТАЕТ ЦВЕТ
				block
				type='primary'
				href='/play'
			>
				Play
			</StyledButton>
			<StyledButton
				style={{ textDecoration: 'none' }}
				block
				type='primary'
				href='/register'
			>
				Sign Up
			</StyledButton>
			<StyledButton
				style={{ textDecoration: 'none' }}
				block
				type='default'
				href='/login'
				title='Log In'
			>
				Log In
			</StyledButton>
		</StyledWrapper>
	)
}
