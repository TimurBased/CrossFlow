import { InternalMove, Piece, PROMOTION, Square } from './types'
import { indexToSquare } from './utils'

export class Move {
  from: Square
  to: Square
  piece: Piece
  captured?: Piece
  promotion?: PROMOTION

  constructor(internal: InternalMove) {
    const { fromIndex, toIndex, piece, captured, promotion } = internal
    const from = indexToSquare(fromIndex)
    const to = indexToSquare(toIndex)

    this.from = from
    this.to = to
    this.piece = piece

    if (captured) {
      this.captured = captured
    }

    if (promotion) {
      this.promotion = promotion
    }
  }
}
