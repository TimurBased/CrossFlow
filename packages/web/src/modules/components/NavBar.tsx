import React from 'react'
import Button from './UI/Button'
import Modal from './UI/Modal/Modal'
import PostForm from './PostForm'
import SignUpForm from './SignUpForm'
import LogInForm from './LogInForm'
import { Post } from '../../types/Post'

interface Props {
	createPost: (newPost: Post) => void
	modal: boolean
	setModal: React.Dispatch<React.SetStateAction<boolean>>
	modalSingUp: boolean
	setModalSingUp: React.Dispatch<React.SetStateAction<boolean>>
	modalLogIn: boolean
	setModalLogIn: React.Dispatch<React.SetStateAction<boolean>>
}

const NavBar: React.FC<Props> = ({
	createPost,
	modal,
	setModal,
	modalSingUp,
	setModalSingUp,
	modalLogIn,
	setModalLogIn,
}) => {
	return (
		<>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: '10px',
				}}
			>
				<Button
					style={{ marginTop: '15px' }}
					onClick={(e: any) => setModal(true)}
				>
					Create post
				</Button>
				<Modal visible={modal} setVisible={setModal}>
					<PostForm createPost={createPost} />
				</Modal>

				<div>
					<Button
						style={{ marginTop: '15px', marginLeft: '15px' }}
						onClick={(e: any) => setModalSingUp(true)}
					>
						Sign Up
					</Button>
					<Modal visible={modalSingUp} setVisible={setModalSingUp}>
						<SignUpForm />
					</Modal>
					<Button
						style={{ marginTop: '15px', marginLeft: '15px' }}
						onClick={(e: any) => setModalLogIn(true)}
					>
						Log in
					</Button>
					<Modal visible={modalLogIn} setVisible={setModalLogIn}>
						<LogInForm />
					</Modal>
				</div>
			</div>

			<hr style={{ margin: '15px 0' }}></hr>
		</>
	)
}

export default NavBar
