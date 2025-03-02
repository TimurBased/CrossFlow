import React, { useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch'
import { setFen, selectPiece, clearSelection, movePiece } from '../model/slice'
import Cell from './Cell'

const BoardContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(8, 75px);
	grid-template-rows: repeat(8, 75px);
`

const Board: React.FC = () => {
	const dispatch = useAppDispatch()
	const { board, fen, selectedPiece, legalMoves, activePlayer } =
		useAppSelector(state => state.board)

	useEffect(() => {
		dispatch(setFen(fen))
	}, [fen, dispatch])

	const handleClick = useCallback(
		(x: number, y: number) => {
			const clickedPiece = board[y][x]

			// Определяем цвет фигуры: заглавные буквы (W) - белые, строчные (b) - чёрные
			const pieceColor = clickedPiece
				? clickedPiece === clickedPiece.toUpperCase()
					? 'w'
					: 'b'
				: null

			// Игрок может выбрать только свои фигуры
			if (clickedPiece && pieceColor !== activePlayer) return

			if (selectedPiece) {
				// Проверяем, является ли клик допустимым ходом
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
					// Если кликнули на фигуру того же цвета — выбираем её
					clickedPiece
						? dispatch(selectPiece({ x, y }))
						: dispatch(clearSelection())
				}
			} else if (clickedPiece) {
				dispatch(selectPiece({ x, y }))
			}
		},
		[dispatch, board, selectedPiece, activePlayer, legalMoves]
	)

	return (
		<DndProvider backend={HTML5Backend}>
			<h2>Player color move: {activePlayer}</h2>
			<BoardContainer>
				{board.map((row, y) =>
					row.map((cell, x) => (
						<Cell
							key={`${y}-${x}`}
							piece={cell}
							isDark={(x + y) % 2 !== 0}
							isLegalMove={legalMoves.some(
								move => move.x === x && move.y === y
							)}
							activePlayer={activePlayer}
							onClick={() => handleClick(x, y)}
							position={{ x, y }}
						/>
					))
				)}
			</BoardContainer>
		</DndProvider>
	)
}

export default Board
