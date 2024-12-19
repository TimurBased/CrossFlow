import { Post } from './Post'
export type Filter = {
	sort: keyof Post | ''
	query: string
}
