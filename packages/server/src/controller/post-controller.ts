import { Request, Response } from 'express'
import postService from '../service/post-service'
class PostController {
	async createPost(req: Request, res: Response) {
		try {
			const { title, description, user_id } = req.body
			const newUser = await postService.createPost(title, description, user_id)
			res.status(201).json(newUser)
		} catch (error: any) {
			console.error(error)
			res.status(500).json({ message: 'Internal server error' })
		}
	}

	async getPost(req: Request, res: Response): Promise<any> {
		try {
			const id = req.params.id
			const post = await postService.getPostById(id)
			if (!post) {
				return res.status(404).json({ message: 'Post not found' })
			}
			res.status(200).json(post)
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: 'Internal server error' })
		}
	}
	async getAllPosts(req: Request, res: Response): Promise<any> {
		try {
			const posts = await postService.getPosts()
			res.status(200).json(posts)
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: 'Internal server error' })
		}
	}
}

export default new PostController()
