import React from 'react'
import Input from './UI/Input'
import Select from './UI/Select'

const PostFilter = ({ filter, setFilter }: any) => {
	return (
		<>
			<Input
				value={filter.query}
				onChange={(e: any) => setFilter({ ...filter, query: e.target.value })}
				placeholder='Search...'
			/>
			<Select
				value={filter.sort}
				onChange={(selectedSort: any) =>
					setFilter({ ...filter, sort: selectedSort })
				}
				defaultValue={'Sorting'}
				options={[
					{ value: 'title', name: 'By name' },
					{ value: 'body', name: 'By descrition' },
				]}
			/>
		</>
	)
}

export default PostFilter
