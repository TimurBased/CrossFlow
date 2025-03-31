import * as React from 'react'
import styled from 'styled-components'

const StyledNotationFile = styled.div`
	pointer-events: none;
	user-select: none;
	position: absolute;
	bottom: -0px;
	left: 0;
	display: flex;
	justify-content: space-between;
	width: 89%;
	font-weight: bold;
	z-index: 10;
`

const Coord = styled.div<{
	isDark: boolean
}>`
	font-size: 14px;
	color: ${({ isDark }) => (isDark ? '#946f51' : '#f0d9b5')};
`

const NotationFile: React.FC = () => {
	return (
		<React.Fragment>
			<StyledNotationFile>
				{['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((letter, index) => (
					<Coord
						key={index}
						isDark={((index % 8) + Math.floor(index / 8)) % 2 === 1}
					>
						{letter}
					</Coord>
				))}
			</StyledNotationFile>
		</React.Fragment>
	)
}

export default NotationFile
