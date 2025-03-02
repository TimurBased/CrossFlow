import React, { useRef } from 'react'
import { useDrag } from 'react-dnd'
import styled from 'styled-components'
import { pieceToComponentMap } from '../lib/utils'

interface FigureProps {
	piece: string
	position: { x: number; y: number }
}

const FigureStyled = styled.img<{ isDragging: boolean }>`
	width: 100%;
	height: 100%;
	opacity: ${props => (props.isDragging ? 0.5 : 1)};
	cursor: grab;
	transition: transform 0.2s ease;

	&:active {
		cursor: grabbing;
		transform: scale(1.1);
	}
`

const Figure: React.FC<FigureProps> = ({ piece, position }) => {
	const ref = useRef<HTMLImageElement>(null)

	const [{ isDragging }, drag] = useDrag({
		type: 'chess-piece',
		item: { FromX: position.x, FromY: position.y },
		collect: monitor => ({ isDragging: monitor.isDragging() }),
	})

	//КОСТЫЛЬ
	drag(ref)

	return (
		<FigureStyled
			ref={ref}
			src={pieceToComponentMap[piece]}
			alt={piece}
			isDragging={isDragging}
		/>
	)
}

export default Figure
