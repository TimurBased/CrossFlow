// components/Square.tsx
import React, { useRef } from 'react'
import Figure from './Figure'
import { useDrag, useDrop } from 'react-dnd'
import { movePiece, selectPiece, clearSelection } from '../model/slice'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { Piece } from '../model/types'

interface SquareProps {
	piece: Piece | null
	x: number
	y: number
}

const Square: React.FC<SquareProps> = ({ piece, x, y }) => {
	const ref = useRef<HTMLDivElement>(null)
	const dispatch = useAppDispatch()

	const [{ isDragging }, drag] = useDrag({
		type: 'chess-piece',
		item: { FromX: x, FromY: y },
		collect: (monitor: any) => ({
			isDragging: !!monitor.isDragging(),
		}),
		end: (item, monitor) => {
			const dropResult = monitor.getDropResult<{ x: number; y: number }>()
			if (item && dropResult) {
				dispatch(
					movePiece({
						FromX: item.FromX,
						FromY: item.FromY,
						toX: dropResult.x,
						toY: dropResult.y,
					})
				)
			} else {
				dispatch(clearSelection())
			}
		},
	})

	const [, drop] = useDrop({
		accept: 'chess-piece',
		drop: () => ({ x, y }),
		hover: () => {
			dispatch(selectPiece({ x, y }))
		},
	})

	drag(drop(ref))

	return (
		<div
			ref={ref}
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: 'transparent',
				opacity: isDragging ? 0.5 : 1,
			}}
		>
			{piece && <Figure piece={piece} position={{ x, y }} />}
		</div>
	)
}

export default Square
