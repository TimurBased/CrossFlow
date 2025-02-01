import { Button, Form, Input } from 'antd'
import React from 'react'
import { IUser } from '../../../types/IUser'

interface Props {
	userList: IUser[]
	submit: () => Promise<any>
}

export const UserView: React.FC<Props> = ({ submit, userList }) => {
	return (
		<div>
			<Form onFinish={submit}>
				<Form.Item label='Email' name='email'>
					<Input />
				</Form.Item>
				<Button type='primary' htmlType='submit'>
					Submit
				</Button>
			</Form>
			<div>
				{userList.map(user => (
					<div key={user.id}>{user.email}</div>
				))}
			</div>
		</div>
	)
}
