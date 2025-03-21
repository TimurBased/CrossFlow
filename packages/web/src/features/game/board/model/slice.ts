import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BoardSchema } from './types'
import { Chess, Square, squareToIndex } from '../lib/chess'

const initialState: BoardSchema = {
	game: new Chess('7k/3Q4/8/2r1b3/8/K1R1B3/8/3q4 w - - 0 1'),
	fen: '',
	selectedPiece: null,
	legalMoves: [],
	isCheck: false,
	gameState: 'active',
}

const boardSlice = createSlice({
	name: 'board',
	initialState,
	reducers: {
		makeMove(state, action: PayloadAction<{ from: Square; to: Square }>) {
			const { from, to } = action.payload
			state.game.MovePiece(from, to)
			state.fen = state.game.toFen()
			state.isCheck = false
			state.gameState = state.game.isGameFinished() ? 'checkmate' : 'active'
			state.legalMoves = []
		},
		selectPiece(state, action: PayloadAction<Square>) {
			const square = action.payload
			const piece = state.game.getBoard()[squareToIndex(square)]

			if (!piece || piece.color !== state.game.getActivePlayer()) {
				state.selectedPiece = null
				return
			}
			state.legalMoves = state.game.generateMoves(piece, square)
			state.selectedPiece = square
		},
		clearSelection(state) {
			state.selectedPiece = null
			state.legalMoves = []
		},
	},
})

export const { makeMove, selectPiece, clearSelection } = boardSlice.actions
export default boardSlice.reducer
