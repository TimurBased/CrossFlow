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
import { Chess, Square } from '../lib/chess'

export interface BoardSchema {
	game: Chess
	selectedPiece: Square | null
	legalMoves: Square[]
	isCheck: boolean
	gameState: 'active' | 'checkmate' | 'stalemate' | 'draw'
	fen: string
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
