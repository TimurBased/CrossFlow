import { FC, useState } from 'react'
import './styles/App.css'
import PostList from './modules/components/PostList'
//  import PostFilter from './modules/components/PostFilter'
import NavBar from './modules/components/NavBar'

import { Post } from './types/Post'

const App: FC = () => {
	const [posts, setPosts] = useState<Post[]>([
		{ id: 1, title: 'aaa', description: 'sgsd' },
		{ id: 2, title: 'bbb', description: 'fsdfas' },
		{ id: 3, title: 'ccc', description: 'adffg' },
	])

	const [modal, setModal] = useState(false)
	const [modalSingUp, setModalSingUp] = useState(false)
	const [modalLogIn, setModalLogIn] = useState(false)

	const createPost = (newPost: Post) => {
		setPosts([...posts, newPost])
		setModal(false)
	}

	const removePost = (post: Post) => {
		setPosts(posts.filter(p => p.id !== post.id))
	}

	return (
		<>
			<div className='App'>
				<NavBar
					createPost={createPost}
					modal={modal}
					setModal={setModal}
					modalSingUp={modalSingUp}
					setModalSingUp={setModalSingUp}
					modalLogIn={modalLogIn}
					setModalLogIn={setModalLogIn}
				/>
				<PostList remove={removePost} posts={posts} title='JavaScript posts' />
			</div>
		</>
	)
}

export default App
