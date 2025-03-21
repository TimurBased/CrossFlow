export const WHITE = 'w'
export const BLACK = 'b'

export const PAWN = 'p'
export const KNIGHT = 'n'
export const BISHOP = 'b'
export const ROOK = 'r'
export const QUEEN = 'q'
export const KING = 'k'

export type Color = typeof WHITE | typeof BLACK
export type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'

// prettier-ignore
export type Square =
    'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8' |
    'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7' |
    'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6' |
    'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5' |
    'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4' |
    'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3' |
    'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2' |
    'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1'

export const DEFAULT_POSITION =
	'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

export type Piece = {
	color: Color
	type: PieceSymbol
}

export type InternalMove = {
	fromIndex: number
	toIndex: number
	piece: Piece
	captured?: Piece
	promotion?: Piece
}

const pawnDirectionOffsets = {
	b: [8, 16, 7, 9],
	w: [-8, -16, -7, -9],
}

const pieceDirectionOffsets = {
	n: [17, -17, 15, -15, 10, -10, 6, -6],
	b: [9, -9, 7, -7],
	r: [8, -8, 1, -1],
	q: [9, -9, 7, -7, 8, -8, 1, -1],
	k: [9, -9, 7, -7, 8, -8, 1, -1],
}

export function squareToIndex(square: Square): number {
	const file = square.charCodeAt(0) - 97
	const rank = 8 - parseInt(square[1], 10)
	return rank * 8 + file
}

export function indexToSquare(index: number): Square {
	const file = String.fromCharCode((index % 8) + 97)
	const rank = 8 - Math.floor(index / 8)
	return `${file}${rank}` as Square
}

export function getFile(index: number): number {
	return (index % 8) + 1
}
export function getRank(index: number): number {
	return 8 - Math.floor(index / 8)
}

export class Chess {
	private _board: (Piece | null)[] = new Array(64).fill(null)
	private _activePlayer: Color = WHITE
	private _kings: Record<Color, number> = { w: -1, b: -1 }
	private _moveHistory: Move[] = []
	private _isGameOver: boolean = false

	constructor(fen: string = DEFAULT_POSITION) {
		this.loadPosition(fen)
	}

	public loadPosition(fen: string): void {
		const [position, turn, castling, enPassant, halfMoves, fullMoves] =
			fen.split(' ')

		this._board.fill(null)

		let squareIndex = 0
		for (const char of position) {
			if (char === '/') {
				continue
			} else if (/\d/.test(char)) {
				squareIndex += parseInt(char, 10)
			} else {
				const color: Color = char === char.toLowerCase() ? 'b' : 'w'
				const type: PieceSymbol = char.toLowerCase() as PieceSymbol
				this._board[squareIndex] = { color, type }
				squareIndex++
			}
		}

		this._activePlayer = turn === 'w' ? 'w' : 'b'

		// TODO: Добавить обработку рокировки, взятия на проходе и счетчиков ходов
	}

	public MovePiece(from: Square, to: Square): Move | null {
		const fromIndex = squareToIndex(from)
		const toIndex = squareToIndex(to)

		const piece = this._board[fromIndex]
		if (!piece) {
			console.warn('На начальной клетке нет фигуры')
			return null
		}
		const possibleMoves = this.generateMoves(piece, from)
		if (!possibleMoves.includes(to)) {
			console.log('no valid move')
			return null
		}
		this._board[toIndex] = piece
		this._board[fromIndex] = null

		const move = new Move({ fromIndex, toIndex, piece } as InternalMove)
		this._moveHistory.push(move)

		this._activePlayer = this._activePlayer === WHITE ? BLACK : WHITE

		// TODO: Проверить состояние игры
		return move
	}

	public generateMoves(piece: Piece, startSquare: Square): Square[] {
		let moves: Square[] = []
		const startSquareIndex: number = squareToIndex(startSquare)

		switch (piece.type) {
			case PAWN:
				moves = [...this._generatePawnMoves(startSquareIndex, piece.color)]
				break
			case KNIGHT:
				moves = [...this._generateKnightMoves(startSquareIndex, piece.color)]
				break
			case KING:
				moves = [...this._generateKingMoves(startSquareIndex, piece.color)]
				break
			default:
				moves = [...this._generateSlidingMoves(startSquareIndex, piece)]
				break
		}
		console.log(moves)
		return moves
	}

	private _generatePawnMoves(startSquareIndex: number, color: Color): Square[] {
		const moves: Square[] = []
		const directions = pawnDirectionOffsets[color]
		for (let i = 0; i < directions.length; i++) {
			const offset = directions[i]
			const targetSquare = startSquareIndex + offset

			// Первый шаг (одно поле вперед)
			if (i === 0 && this._isValidMove(startSquareIndex, targetSquare)) {
				if (!this._board[targetSquare]) {
					moves.push(indexToSquare(targetSquare))
				}
			}

			// Второй шаг (два поля вперед, только из начальной позиции)
			if (i === 1) {
				const isStartingRank =
					(color === 'w' && startSquareIndex >= 48 && startSquareIndex <= 55) ||
					(color === 'b' && startSquareIndex >= 8 && startSquareIndex <= 15)
				if (
					isStartingRank &&
					!this._board[startSquareIndex + directions[0]] &&
					!this._board[targetSquare] &&
					this._isValidMove(startSquareIndex, targetSquare)
				) {
					moves.push(indexToSquare(targetSquare))
				}
			}

			// Взятие по диагонали
			if (
				(i === 2 || i === 3) &&
				this._isValidMove(startSquareIndex, targetSquare)
			) {
				const targetPiece = this._board[targetSquare]
				if (targetPiece && targetPiece.color !== color) {
					moves.push(indexToSquare(targetSquare))
				}
			}
		}
		return moves
	}
	private _generateKingMoves(startSquareIndex: number, color: Color): Square[] {
		const directions = pieceDirectionOffsets[KING]
		const moves: Square[] = []
		for (const offset of directions) {
			let targetSquare = startSquareIndex + offset
			if (this._isValidMove(startSquareIndex, targetSquare)) {
				const targetPiece = this._board[targetSquare]

				if (!targetPiece || targetPiece.color !== color) {
					moves.push(indexToSquare(targetSquare))
				}
			}
		}
		return moves
	}

	private _generateKnightMoves(
		startSquareIndex: number,
		color: Color
	): Square[] {
		const directions = pieceDirectionOffsets[KNIGHT]
		const moves: Square[] = []
		for (const offset of directions) {
			let targetSquare = startSquareIndex + offset
			if (this._isValidMove(startSquareIndex, targetSquare, true)) {
				const targetPiece = this._board[targetSquare]

				if (!targetPiece || targetPiece.color !== color) {
					moves.push(indexToSquare(targetSquare))
				}
			}
		}
		return moves
	}

	private _generateSlidingMoves(
		startSquareIndex: number,
		piece: Piece
	): Square[] {
		const moves: Square[] = []

		const directions =
			piece.type === QUEEN
				? pieceDirectionOffsets[QUEEN]
				: piece.type === BISHOP
				? pieceDirectionOffsets[BISHOP]
				: pieceDirectionOffsets[ROOK]

		for (const offset of directions) {
			let targetSquare = startSquareIndex + offset
			while (this._isValidMove(startSquareIndex, targetSquare)) {
				const targetPiece = this._board[targetSquare]

				if (!targetPiece) {
					moves.push(indexToSquare(targetSquare))
				}

				if (targetPiece && targetPiece.color !== piece.color) {
					moves.push(indexToSquare(targetSquare))
					break
				}

				if (targetPiece && targetPiece.color === piece.color) {
					break
				}

				targetSquare += offset
			}
		}
		return moves
	}

	private _isValidMove(
		fromIndex: number,
		toIndex: number,
		isKnight?: boolean
	): boolean {
		if (toIndex < 0 || toIndex > 63) return false

		const fileDiff = Math.abs(getFile(fromIndex) - getFile(toIndex))
		const rankDiff = Math.abs(getRank(fromIndex) - getRank(toIndex))

		if (
			(fileDiff === 2 && rankDiff === 1) ||
			(fileDiff === 1 && rankDiff === 2)
		) {
			return true
		}

		if (!isKnight) {
			//МЕГА КОСТЫЛЬ
			if (fileDiff === rankDiff && fileDiff > 0) return true
			if (fileDiff === 0 && rankDiff > 0) return true
			if (rankDiff === 0 && fileDiff > 0) return true
		}
		return false
	}

	public toFen(): string {
		let fen = ''

		for (let rank = 0; rank < 8; rank++) {
			let emptyCount = 0
			for (let file = 0; file < 8; file++) {
				const index = rank * 8 + file
				const piece = this._board[index]

				if (!piece) {
					emptyCount++
				} else {
					if (emptyCount > 0) {
						fen += emptyCount
						emptyCount = 0
					}
					const symbol =
						piece.color === 'w'
							? piece.type.toUpperCase()
							: piece.type.toLowerCase()
					fen += symbol
				}
			}
			if (emptyCount > 0) {
				fen += emptyCount
			}
			if (rank < 7) {
				fen += '/'
			}
		}

		const activeColor = this._activePlayer === 'w' ? 'w' : 'b'
		/* TODO */
		let castlingRights = '-'

		const enPassant = '-'

		const halfMoveClock = '0'

		const fullMoveNumber = `${Math.floor(this._moveHistory.length / 2) + 1}`

		// Собираем строку FEN
		return `${fen} ${activeColor} ${castlingRights} ${enPassant} ${halfMoveClock} ${fullMoveNumber}`
	}

	public getBoard(): (Piece | null)[] {
		return [...this._board]
	}

	public getActivePlayer(): Color {
		return this._activePlayer
	}

	public isGameFinished(): boolean {
		return this._isGameOver
	}
}

export class Move {
	from: Square
	to: Square
	piece: Piece
	captured?: Piece
	promotion?: Piece

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
	toString(): string {
		return `${this.piece.type} (${this.piece.color}) moves from ${this.from} to ${this.to}`
	}
}
