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
  game: new Chess('rnbqkbn1/1ppp4/p2B4/4Q1P1/3pP2N/2N3P1/PPP5/R3KB b Q - 0 4'),
  //1k6/8/1K6/8/8/8/8/8 w - - 0 1  БАГ С ДВУМЯ КОРОЛЯМИ
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
