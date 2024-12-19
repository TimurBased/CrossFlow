import express, { Router } from 'express'
import postController from '../controller/post-controller'

const PostRouter: Router = express.Router()

PostRouter.get('/posts', postController.getAllPosts)
PostRouter.post('/post', postController.createPost)
PostRouter.get('/post/:id', postController.getPost)

export default PostRouter
