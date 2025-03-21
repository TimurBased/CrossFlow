import * as React from 'react'
import styled from 'styled-components'

const StyledNotationRank = styled.div`
	pointer-events: none;
	user-select: none;
	position: absolute;
	top: 0;
	right: -0px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 90%;
	font-weight: bold;
	z-index: 10;
	font-size: 14px;
	color: rgb(0, 0, 0);
`
const Coord = styled.div<{
	isDark: boolean
}>`
	font-size: 14px;
	color: ${({ isDark }) => (isDark ? '#946f51' : '#f0d9b5')};
`
const NotationRank: React.FC = () => {
	return (
		<React.Fragment>
			<StyledNotationRank>
				{['8', '7', '6', '5', '4', '3', '2', '1'].map((number, index) => (
					<Coord
						key={index}
						isDark={((index % 8) + Math.floor(index / 8)) % 2 === 1}
					>
						{number}
					</Coord>
				))}
			</StyledNotationRank>
		</React.Fragment>
	)
}

export default NotationRank
