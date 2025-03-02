// model/slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BoardSchema, BoardState } from './types'
import { isValidMove } from '../lib/utils'

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
	fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
	board: [],
	selectedPiece: null,
	legalMoves: [],
	activePlayer: 'w',
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

			if (pieceColor !== state.activePlayer) {
				alert('Ход другого игрока')
				return
			}

			// if (FromX === toX && FromY === toY) {
			// 	console.warn('Не перетащил фигуру')
			// 	return
			// }

			if (!piece || !isValidMove(piece, FromX, FromY, toX, toY, state.board)) {
				console.warn('Неверный ход')
				return
			}

			state.board[FromY][FromX] = null
			state.board[toY][toX] = piece

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
					if (isValidMove(piece, x, y, j, i, state.board)) {
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

function boardToFen(board: BoardState, activePlayer: 'w' | 'b'): string {
	let newFen = board
		.map(row =>
			row
				.map(cell => (cell ? cell : '1'))
				.join('')
				.replace(/1+/g, match => match.length.toString())
		)
		.join('/')

	return `${newFen} ${activePlayer}`
}
function fenToBoard(fen: string): BoardState {
	let newBoard = fen
		.split(' ')[0]
		.split('/')
		.map(row =>
			row
				.match(/(\d+|[PNBRQKpnbrqk])/g)!
				.flatMap(item =>
					isNaN(Number(item)) ? item : Array(Number(item)).fill(null)
				)
		)

	return newBoard
}
