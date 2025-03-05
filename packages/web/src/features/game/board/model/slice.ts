import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BoardSchema } from './types'
import { isValidMove } from '../lib/isValidMove'
import { fenToBoard, boardToFen } from '../lib/fenOperation'
import { canCastle, kingSpecialMoves } from '../lib/castling'
import { isCheck } from '../lib/isCheck'
type MovePayload = {
	FromX: number
	FromY: number
	toX: number
	toY: number
}

type SelectPiecePayload = {
	x: number
	y: number
}

const initialState: BoardSchema = {
	fen: 'r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 b - - 0 19',
	board: [],
	activePlayer: 'w',
	selectedPiece: null,
	legalMoves: [],
	isCheck: false,
	gameState: 'active',
}

const boardSlice = createSlice({
	name: 'board',
	initialState,
	reducers: {
		setFen(state, action: { payload: string }) {
			state.fen = action.payload
			state.board = fenToBoard(action.payload)
			state.selectedPiece = null
			state.legalMoves = []
		},
		movePiece(state, action: PayloadAction<MovePayload>) {
			const { FromX, FromY, toX, toY } = action.payload

			const piece = state.board[FromY][FromX]

			const pieceColor = piece?.toUpperCase() == piece ? 'w' : 'b'

			if (
				!piece ||
				!isValidMove(piece, state.board, state.fen, FromX, FromY, toX, toY)
			) {
				console.warn('Неверный ход')
				return
			}

			if (
				piece.toUpperCase() === 'K' &&
				((Math.abs(toX - FromX) === 2 && FromY === toY) ||
					(FromX === 4 && FromY === (pieceColor === 'w' ? 7 : 0)))
			) {
				const isKingSide = toX > FromX // Короткая рокировка, если toX > FromX

				// Проверяем возможность рокировки
				if (
					!canCastle(
						state.board,
						state.fen,
						FromX,
						FromY,
						toX,
						isKingSide,
						pieceColor === 'w'
					)
				) {
					console.warn('Рокировка невозможна')
					return
				}
				// Выполняем рокировку
				state.board = kingSpecialMoves(
					state.board,
					pieceColor === 'w',
					FromX,
					FromY,
					toX,
					toY
				)

				// Обновляем FEN
				state.fen = boardToFen(state.board, state.activePlayer)
			} else {
				// Обычный ход
				state.board[FromY][FromX] = null
				state.board[toY][toX] = piece

				// Обновляем FEN
				state.fen = boardToFen(state.board, state.activePlayer)
			}

			state.activePlayer = state.activePlayer === 'w' ? 'b' : 'w'

			state.fen = boardToFen(state.board, state.activePlayer)

			state.selectedPiece = null
			state.legalMoves = []
		},
		selectPiece(state, action: PayloadAction<SelectPiecePayload>) {
			const { x, y } = action.payload
			const piece = state.board[y][x]

			const pieceColor = piece?.toUpperCase() == piece ? 'w' : 'b'

			if (pieceColor !== state.activePlayer) {
				state.selectedPiece = null
				return
			}

			if (!piece) {
				state.selectedPiece = null
				state.legalMoves = []
				return
			}
			state.selectedPiece = { x, y }
			state.legalMoves = []
			for (let i = 0; i < 8; ++i) {
				for (let j = 0; j < 8; ++j) {
					if (isValidMove(piece, state.board, state.fen, x, y, j, i)) {
						state.legalMoves.push({ x: j, y: i })
					}
				}
			}
		},
		clearSelection(state) {
			state.selectedPiece = null
			state.legalMoves = []
		},
	},
})

export const { setFen, movePiece, selectPiece, clearSelection } =
	boardSlice.actions
export default boardSlice.reducer
