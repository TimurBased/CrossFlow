// components/Board.tsx
import React, { useEffect, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch'
import { setFen, selectPiece, clearSelection, movePiece } from '../model/slice'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Square from './Square'

const Board: React.FC = () => {
	const ref = useRef<HTMLDivElement>(null)
	const dispatch = useAppDispatch()
	const { board, fen, selectedPiece, legalMoves } = useAppSelector(
		state => state.board
	)

	useEffect(() => {
		dispatch(setFen(fen))
	}, [fen, dispatch])

	const handleClick = (x: number, y: number) => {
		if (selectedPiece) {
			if (legalMoves.some(move => move.x === x && move.y === y)) {
				dispatch(
					movePiece({
						FromX: selectedPiece.x,
						FromY: selectedPiece.y,
						toX: x,
						toY: y,
					})
				)
			} else {
				dispatch(clearSelection())
			}
		} else {
			dispatch(selectPiece({ x, y }))
		}
	}

	return (
		<DndProvider backend={HTML5Backend}>
			<div
				ref={ref}
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(8, 75px)',
					gridTemplateRows: 'repeat(8, 75px)',
				}}
			>
				{board.map((row, y) =>
					row.map((cell, x) => (
						<div
							key={`${x}-${y}`}
							onClick={() => handleClick(x, y)}
							style={{
								backgroundColor: (x + y) % 2 === 0 ? '#f0d9b5' : '#b58863',
								width: '75px',
								height: '75px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								position: 'relative',
								cursor: 'pointer',
							}}
						>
							{legalMoves.some(move => move.x === x && move.y === y) && (
								<div
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										height: '100%',
										backgroundColor: 'rgba(0, 255, 0, 0.3)',
									}}
								/>
							)}
							<Square piece={cell} x={x} y={y} />
						</div>
					))
				)}
			</div>
		</DndProvider>
	)
}

export default Board
