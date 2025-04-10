import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BoardSchema } from './types'
import { Chess } from '../lib/chess'
import { DEFAULT_POSITION, Square } from '../lib/types'
import { indexToSquare, squareToIndex } from '../lib/utils'

const initialState: BoardSchema = {
  game: new Chess(DEFAULT_POSITION),
  fen: '',
  selectedPiece: null,
  legalMoves: [],
  promotionWindow: false,
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

      // if (
      //   state.game.isPromotion(state.game.getPiece(from), squareToIndex(to))
      // ) {
      //   state.promotionWindow = true
      // }
      if (state.isCheck) {
        state.kingPosition = indexToSquare(
          state.game.getKingPosition(state.game.getActivePlayer())
        )
      }

      if (state.game.isGameOver()) state.gameState = state.game.getGameState()

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
    // TODO
    // promotionMove(state, action: PayloadAction<PROMOTION>) {},
  },
})

export const { makeMove, selectPiece, clearSelection } = boardSlice.actions
export default boardSlice.reducer
