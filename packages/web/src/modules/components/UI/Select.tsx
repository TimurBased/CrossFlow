import React from 'react'

const Select = ({ options, defaultValue, value, onChange }: any) => {
	return (
		<select value={value} onChange={e => onChange(e.target.value)}>
			<option disabled value=''>
				{defaultValue}
			</option>
			{options.map((option: any) => (
				<option key={option.value} value={option?.value}>
					{option.name}
				</option>
			))}
		</select>
	)
}

export default Select
