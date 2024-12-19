import React from 'react'
import Input from './UI/Input'
import Button from './UI/Button'

const PostForm = ({ createPost }: any) => {
	const [post, setPost] = React.useState({ title: '', body: '' })

	const addNewPost = (e: any) => {
		e.preventDefault()
		const newPost = {
			...post,
			id: Date.now(),
		}

		if (post.title.trim() !== '' && post.body.trim() !== '') {
			createPost(newPost)
			setPost({ title: '', body: '' })
		} else {
			return alert('fill post')
		}
	}

	return (
		<form>
			<h1 style={{ textAlign: 'center', marginBottom: '20px' }}>CreatePost</h1>
			<Input
				value={post.title}
				onChange={(e: any) => setPost({ ...post, title: e.target.value })}
				type='text'
				placeholder='Name post'
			/>
			<Input
				value={post.body}
				onChange={(e: any) => setPost({ ...post, body: e.target.value })}
				type='text'
				placeholder='Descrition post'
			/>

			<Button style={{ marginRight: '10px' }} onClick={addNewPost}>
				Create post
			</Button>
			<Button>Cancel</Button>
		</form>
	)
}

export default PostForm
