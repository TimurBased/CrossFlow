export const WHITE = 'w'
export const BLACK = 'b'

export const EMPTY = 'e'
export const PAWN = 'p'
export const KNIGHT = 'n'
export const BISHOP = 'b'
export const ROOK = 'r'
export const QUEEN = 'q'
export const KING = 'k'

export type Color = typeof WHITE | typeof BLACK
export type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k' | 'e' | 'o' // 'e' is empty cell and 'o' its part of 0x88 algorithm

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

// prettier-ignore
// eslint-disable-next-line
export const Ox88: Record<Square, number> = {
  a8:   0, b8:   1, c8:   2, d8:   3, e8:   4, f8:   5, g8:   6, h8:   7,
  a7:  16, b7:  17, c7:  18, d7:  19, e7:  20, f7:  21, g7:  22, h7:  23,
  a6:  32, b6:  33, c6:  34, d6:  35, e6:  36, f6:  37, g6:  38, h6:  39,
  a5:  48, b5:  49, c5:  50, d5:  51, e5:  52, f5:  53, g5:  54, h5:  55,
  a4:  64, b4:  65, c4:  66, d4:  67, e4:  68, f4:  69, g4:  70, h4:  71,
  a3:  80, b3:  81, c3:  82, d3:  83, e3:  84, f3:  85, g3:  86, h3:  87,
  a2:  96, b2:  97, c2:  98, d2:  99, e2: 100, f2: 101, g2: 102, h2: 103,
  a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
}

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
  b: [16, 32, 15, 17],
  w: [-16, -32, -15, -17],
}

const pieceDirectionOffsets = {
  n: [-18, -33, -31, -14, 18, 33, 31, 14],
  b: [-17, -15, 17, 15],
  r: [-16, 1, 16, -1],
  q: [-17, -16, -15, 1, 17, 16, 15, -1],
  k: [-17, -16, -15, 1, 17, 16, 15, -1],
}

export function squareToIndex(square: Square): number {
  return Ox88[square]
}

export function indexToSquare(index: number): Square {
  const f = getFile(index)
  const r = getRank(index)
  return ('abcdefgh'.substring(f, f + 1) +
    '87654321'.substring(r, r + 1)) as Square
}

export function getFile(index: number): number {
  return index & 0xf
}

export function getRank(index: number): number {
  return index >> 4
}

export class Chess {
  private _board: Piece[] = new Array(128).fill({ type: 'e' } as Piece)
  private _activePlayer: Color = WHITE
  _kings: Record<Color, number> = { w: -1, b: -1 }
  private _moveHistory: Move[] = []
  private _isGameOver: boolean = false

  constructor(fen: string = DEFAULT_POSITION) {
    this.loadPosition(fen)
    console.log('making chess instance')
  }

  public loadPosition(fen: string): void {
    const [position, turn] = fen.split(' ')

    let square = 0
    for (let i = 0; i < position.length; i++) {
      const piece = position.charAt(i)

      if (piece === '/') {
        square += 8
      } else if (/\d/.test(piece)) {
        square += parseInt(piece, 10)
      } else {
        const color: Color = piece === piece.toLowerCase() ? BLACK : WHITE
        const type: PieceSymbol = piece.toLowerCase() as PieceSymbol
        this._putPiece({ type: type, color }, indexToSquare(square))
        square++
      }
    }

    this._activePlayer = turn === WHITE ? WHITE : BLACK

    // TODO: Добавить обработку рокировки, взятия на проходе и счетчиков ходов
  }

  private _putPiece(
    { type, color }: { type: PieceSymbol; color: Color },
    square: Square
  ): boolean {
    // check for piece
    if ('pnbrqkPNBRQK'.indexOf(type.toLowerCase()) === -1) {
      return false
    }

    // check for valid square
    if (!(square in Ox88)) {
      return false
    }

    const sq = Ox88[square]

    this._board[sq] = { type: type as PieceSymbol, color: color as Color }

    if (type === KING) {
      this._kings[color] = sq
    }

    return true
  }

  public MovePiece(from: Square, to: Square): Move | null {
    const fromIndex = squareToIndex(from)
    const toIndex = squareToIndex(to)

    const piece = this._board[fromIndex]
    if (piece.color !== this._activePlayer) return null

    const possibleMoves = this.generateMoves(piece, from)
    if (!possibleMoves.includes(to)) {
      return null
    }
    this._board[toIndex] = piece
    this._board[fromIndex] = { type: 'e' } as Piece

    //если ход короля то в записи меняем координаты короля с текущим цветом
    if (piece.type === KING) {
      this._kings[piece.color] = toIndex
    }
    const move = new Move({ fromIndex, toIndex, piece } as InternalMove)
    this._moveHistory.push(move)

    this._activePlayer = this.swapColor(this._activePlayer)

    // TODO: Проверить состояние игры
    return move
  }

  swapColor(color: Color): Color {
    return color === WHITE ? BLACK : WHITE
  }
  isAttacked(color: Color, squareIndex: number): boolean
  isAttacked(color: Color, squareIndex: number, verbose: false): boolean
  isAttacked(color: Color, squareIndex: number, verbose: true): Square[]
  isAttacked(color: Color, squareIndex: number, verbose?: boolean) {
    const attackers: Square[] = []
    for (let i = Ox88.a8; i <= Ox88.h1; i++) {
      // did we run off the end of the board
      if (i & 0x88) {
        i += 7
        continue
      }

      // if empty square or wrong color
      if (this._board[i].type === 'e' || this._board[i].color === color) {
        continue
      }

      const piece = this._board[i]
      if (piece.type !== 'k') {
        const possibleMoves = this.generateMoves(piece, indexToSquare(i))
        console.log(piece?.type)
        if (possibleMoves.includes(indexToSquare(squareIndex))) {
          if (verbose) {
            attackers.push(indexToSquare(i))
            continue
          } else return true
        }
      }
    }

    if (verbose) {
      return attackers
    } else {
      return false
    }
  }

  public isKingAttacked(color: Color): boolean {
    return this.isAttacked(color, this._kings[color])
  }
  public isCheck(): boolean {
    return this.isKingAttacked(this._activePlayer)
  }
  public generateMoves(piece: Piece, startSquare: Square): Square[] {
    const sq = Ox88[startSquare]
    const moves: Square[] = []

    switch (piece.type) {
      case 'p':
        moves.push(...this._generatePawnMoves(sq, piece.color))
        break
      case 'n':
        moves.push(...this._generateKnightMoves(sq, piece.color))
        break
      case 'k':
        moves.push(...this._generateKingMoves(sq, piece.color))
        break
      default:
        moves.push(...this._generateSlidingMoves(sq, piece))
        break
    }

    // console.log(moves)
    return moves
  }

  private _generatePawnMoves(startIndex: number, color: Color): Square[] {
    const moves: Square[] = []
    const directions = pawnDirectionOffsets[color]
    const rank = getRank(startIndex)

    for (const offset of directions) {
      const targetIndex = startIndex + offset
      const targetPiece = this._board[targetIndex]

      if (targetIndex & 0x88) {
        continue
      }

      if (rank === 1 || rank === 6) {
        if (offset === 32 || offset === -32) {
          if (targetPiece.type == 'e') {
            moves.push(indexToSquare(targetIndex))
          }
          continue
        }
      }
      if (offset === 16 || offset === -16) {
        if (targetPiece.type == 'e') {
          moves.push(indexToSquare(targetIndex))
        }
        continue
      }

      if (Math.abs(offset) === 17 || Math.abs(offset) === 15) {
        if (targetPiece.type !== 'e' && targetPiece.color !== color) {
          moves.push(indexToSquare(targetIndex))
        }
      }
    }

    return moves
  }

  private _generateKnightMoves(startIndex: number, color: Color): Square[] {
    const moves: Square[] = []
    const directions = pieceDirectionOffsets[KNIGHT]

    for (const offset of directions) {
      const targetIndex = startIndex + offset
      if (targetIndex & 0x88) {
        continue
      }
      const targetPiece = this._board[targetIndex]

      if (!targetPiece || targetPiece.color !== color) {
        moves.push(indexToSquare(targetIndex))
      }
    }

    return moves
  }

  private _generateKingMoves(startIndex: number, color: Color): Square[] {
    const moves: Square[] = []
    const directions = pieceDirectionOffsets[KING]

    for (const offset of directions) {
      const targetIndex = startIndex + offset

      if (targetIndex & 0x88) {
        continue
      }

      const targetPiece = this._board[targetIndex]

      if (!targetPiece || targetPiece.color !== color) {
        const originalPiece = this._board[targetIndex]
        this._board[targetIndex] = this._board[startIndex]
        this._board[startIndex] = { type: 'e' } as Piece
        this._kings[color] = targetIndex

        if (!this.isKingAttacked(color)) {
          moves.push(indexToSquare(targetIndex))
        }

        this._board[startIndex] = this._board[targetIndex]
        this._board[targetIndex] = originalPiece
        this._kings[color] = startIndex
      }
    }

    return moves
  }

  private _generateSlidingMoves(startIndex: number, piece: Piece): Square[] {
    const moves: Square[] = []
    const directions =
      piece.type === QUEEN
        ? pieceDirectionOffsets[QUEEN]
        : piece.type === BISHOP
        ? pieceDirectionOffsets[BISHOP]
        : pieceDirectionOffsets[ROOK]

    for (const offset of directions) {
      let targetIndex = startIndex + offset

      while (!(targetIndex & 0x88)) {
        const targetPiece = this._board[targetIndex]

        // если пустое поле 'e' = empty cell
        if (targetPiece.type === 'e') {
          moves.push(indexToSquare(targetIndex))
          targetIndex += offset
          continue
        }

        // если вражеская фигура
        if (targetPiece && targetPiece.color !== piece.color) {
          moves.push(indexToSquare(targetIndex))
          break
        }
        // если френдли фигура остановка
        if (targetPiece && targetPiece.color === piece.color) {
          break
        }
      }
    }

    return moves
  }

  public toFen(): string {
    let fen = ''
    let emptyCount = 0
    for (let i = Ox88.a8; i < Ox88.h1; i++) {
      if (i & 0x88) {
        i += 7 // ТУТ ВОЗМОЖНО ОШИБКА
        if (emptyCount > 0) {
          fen += emptyCount
        }
        if (getRank(i) < 7) {
          fen += '/'
          emptyCount = 0
        }
        continue
      }

      const piece = this._board[i]

      if (piece.type === 'e') {
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

    const activeColor = this._activePlayer === 'w' ? 'w' : 'b'
    /* TODO */
    let castlingRights = '-'

    const enPassant = '-'

    const halfMoveClock = '0'

    const fullMoveNumber = `${Math.floor(this._moveHistory.length / 2) + 1}`

    // Собираем строку FEN
    return `${fen} ${activeColor} ${castlingRights} ${enPassant} ${halfMoveClock} ${fullMoveNumber}`
  }

  // public getBoard(): (Piece | null)[] {
  // 	const board = new Array<Piece | null>().fill(null)
  // 	for (let i = Ox88.a8; i <= Ox88.h1; i++) {
  // 		if (this._board[i] !== null) {
  // 			board.push(this._board[i])
  // 		} else {
  // 			board.push(null)
  // 		}
  // 		if ((i + 1) & 0x88) {
  // 			i += 8
  // 		}
  // 	}

  // 	return board
  // }

  public getBoard() {
    return this._board.map((element, index) => {
      if (index & 0x88) {
        return { type: 'o' } as Piece
      } else if (element === null) {
        return { type: 'e' } as Piece
      }
      return element
    })
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
