import WhitePawn from '@/shared/assets/icons/WP.png'
import WhiteKnight from '@/shared/assets/icons/WN.png'
import WhiteBishop from '@/shared/assets/icons/WB.png'
import WhiteRook from '@/shared/assets/icons/WR.png'
import WhiteQueen from '@/shared/assets/icons/WQ.png'
import WhiteKing from '@/shared/assets/icons/WK.png'

import BlackPawn from '@/shared/assets/icons/BP.png'
import BlackKnight from '@/shared/assets/icons/BN.png'
import BlackBishop from '@/shared/assets/icons/BB.png'
import BlackRook from '@/shared/assets/icons/BR.png'
import BlackQueen from '@/shared/assets/icons/BQ.png'
import BlackKing from '@/shared/assets/icons/BK.png'

export type Piece =
	| 'P'
	| 'N'
	| 'B'
	| 'R'
	| 'Q'
	| 'K'
	| 'p'
	| 'n'
	| 'b'
	| 'r'
	| 'q'
	| 'k'

export type Row = (Piece | null)[]
export type BoardState = Row[]

export interface BoardSchema {
	fen: string
	board: BoardState
	selectedPiece: { x: number; y: number } | null
	legalMoves: { x: number; y: number }[]
	activePlayer: 'w' | 'b'
	isCheck: boolean
	gameState: 'active' | 'checkmate' | 'stalemate' | 'draw'
}

export const pieceToComponentMap: Record<string, string> = {
	P: WhitePawn,
	N: WhiteKnight,
	B: WhiteBishop,
	R: WhiteRook,
	Q: WhiteQueen,
	K: WhiteKing,
	p: BlackPawn,
	n: BlackKnight,
	b: BlackBishop,
	r: BlackRook,
	q: BlackQueen,
	k: BlackKing,
}
