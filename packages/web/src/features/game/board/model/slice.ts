import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BoardSchema } from './types'
import {
  Chess,
  DEFAULT_POSITION,
  indexToSquare,
  Square,
  squareToIndex,
} from '../lib/chess'

const initialState: BoardSchema = {
  game: new Chess(DEFAULT_POSITION),
  fen: '',
  selectedPiece: null,
  legalMoves: [],
  isCheck: false,
  kingPosition: null,
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
      state.isCheck = state.game.isCheck()
      if (state.isCheck) {
        state.kingPosition = indexToSquare(
          state.game._kings[state.game.getActivePlayer()]
        )
      }
      state.gameState = state.game.isGameFinished() ? 'checkmate' : 'active'
      state.legalMoves = []
    },
    selectPiece(state, action: PayloadAction<Square>) {
      const square = action.payload
      const piece = state.game.getBoard()[squareToIndex(square)]

      if (piece.color !== state.game.getActivePlayer()) {
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
