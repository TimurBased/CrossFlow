import React, { useRef } from 'react'
import styled from 'styled-components'
import { useDrag } from 'react-dnd'
import { pieceToComponentMap } from '@/features/game/board/model/types'
import { Piece, Square } from '../lib/chess'

const FigureStyled = styled.img<{ isDragging: boolean }>`
	width: 100%;
	height: 100%;
	opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
	cursor: grab;

	&:active {
		cursor: grabbing;
		transform: scale(1.1);
	}
`

interface FigureProps {
	piece: Piece
	square: Square
}

const Figure: React.FC<FigureProps> = React.memo(({ piece, square }) => {
	const ref = useRef<HTMLImageElement>(null)

	const [{ isDragging }, drag] = useDrag({
		type: 'chess-piece',
		item: { from: square },
		collect: monitor => ({
			isDragging: monitor.isDragging(),
		}),
	})

	drag(ref)

	return (
		<FigureStyled
			ref={ref}
			src={
				pieceToComponentMap[
					piece.color === 'b' ? piece.type : piece.type.toUpperCase()
				]
			}
			alt={piece.type}
			isDragging={isDragging}
		/>
	)
})

export default Figure
