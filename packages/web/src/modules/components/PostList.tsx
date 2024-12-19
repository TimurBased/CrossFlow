import React from 'react'
import PostItem from './PostItem'

const PostList = ({ posts, title, remove }: any) => {
	return (
		<>
			<h1 style={{ textAlign: 'center' }}>{title}</h1>
			{posts.map((post: any, index: number) => (
				<PostItem
					remove={remove}
					number={index + 1}
					post={post}
					key={post.id}
				/>
			))}
		</>
	)
}

export default PostList
