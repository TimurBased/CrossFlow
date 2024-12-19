import { dataSource } from '../data-source/data-source'
import { Post } from '../entity/Post'

class PostService {
	private postRepository = dataSource.getRepository(Post)

	async createPost(title: string, description: string, user_id: string) {
		const newPost = this.postRepository.create({
			title,
			description,
			user_id,
		})
		return await this.postRepository.save(newPost)
	}
	async getPostById(id: string) {
		return await this.postRepository.findOne({ where: { id: id } })
	}
	async getPosts() {
		return await this.postRepository.find()
	}
}

export default new PostService()
