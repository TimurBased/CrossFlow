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
}
