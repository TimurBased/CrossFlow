import { isJSDocUnknownTag } from 'typescript'

export const WHITE = 'w'
export const BLACK = 'b'

export const EMPTY = 'e'
export const PAWN = 'p'
export const KNIGHT = 'n'
export const BISHOP = 'b'
export const ROOK = 'r'
export const QUEEN = 'q'
export const KING = 'k'

export type PROMOTION =
  | typeof QUEEN
  | typeof ROOK
  | typeof BISHOP
  | typeof KNIGHT

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
  private _kings: Record<Color, number> = { w: -1, b: -1 }
  private _moveHistory: Move[] = []
  private _isGameOver: boolean = false
  private _castling: Record<
    Color,
    Record<typeof KING | typeof QUEEN, boolean>
  > = { w: { k: false, q: false }, b: { k: false, q: false } }
  constructor(fen: string = DEFAULT_POSITION) {
    this.loadPosition(fen)
  }

  public loadPosition(fen: string): void {
    const [position, turn, castlingPart] = fen.split(' ')

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

    for (let i = 0; i < 3; i++) {
      switch (castlingPart[i]) {
        case 'K':
          this._castling[WHITE][KING] = true
          break
        case 'Q':
          this._castling[WHITE][QUEEN] = true
          break
        case 'k':
          this._castling[BLACK][KING] = true
          break
        case 'q':
          this._castling[BLACK][QUEEN] = true
          break
      }
    }

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

    if (this.isPromotion(piece, toIndex)) {
      console.log('ITS PROMOTION')
    }
    if (
      piece.type === KING &&
      (Math.abs(toIndex - fromIndex) === 2 ||
        Math.abs(toIndex - fromIndex) === 3 ||
        Math.abs(toIndex - fromIndex) === 4)
    ) {
      const isKingSide = toIndex > fromIndex
      const rookFrom = isKingSide ? fromIndex + 3 : fromIndex - 4
      const rookTo = isKingSide ? fromIndex + 1 : fromIndex - 1
      const kingToIndex = isKingSide ? fromIndex + 2 : fromIndex - 2
      const rook = this._board[rookFrom]
      if (rook.type !== ROOK || rook.color !== piece.color) return null

      // Перемещение короля
      this._board[kingToIndex] = piece
      this._board[fromIndex] = { type: 'e' } as Piece

      // Перемещение ладьи
      this._board[rookTo] = rook
      this._board[rookFrom] = { type: 'e' } as Piece

      // Отключаем возможность дальнейшей рокировки
      this._castling[piece.color][QUEEN] = false
      this._castling[piece.color][KING] = false
      this._kings[piece.color] = toIndex

      this._activePlayer = this.swapColor(this._activePlayer)
      return new Move({ fromIndex, toIndex, piece } as InternalMove)
    }

    this._board[toIndex] = piece
    this._board[fromIndex] = { type: 'e' } as Piece

    if (piece.type === ROOK) {
      if (fromIndex === Ox88.a1 || fromIndex === Ox88.a8) {
        this._castling[piece.color][QUEEN] = false
      }
      if (fromIndex === Ox88.h8 || fromIndex === Ox88.h1) {
        this._castling[piece.color][KING] = false
      }
    }

    if (this.isCheckMate()) {
      this._isGameOver = true
    }
    if (piece.type === KING) {
      this._castling[piece.color][QUEEN] = false
      this._castling[piece.color][KING] = false
      this._kings[piece.color] = toIndex
    }
    const move = new Move({ fromIndex, toIndex, piece } as InternalMove)
    this._moveHistory.push(move)

    this._activePlayer = this.swapColor(this._activePlayer)

    // TODO: Проверить состояние игры
    return move
  }

  getPiece(square: Square): Piece {
    return this._board[Ox88[square]]
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
      if (this._board[i].type === EMPTY || this._board[i].color === color) {
        continue
      }

      const piece = this._board[i]
      if (piece.type !== KING) {
        const possibleMoves = this._privateGenerateMoves(
          piece,
          indexToSquare(i)
        )

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

  public isCheckMate(): boolean {
    return (
      this.isKingAttacked(this.swapColor(this._activePlayer)) &&
      this._generateAllPossibleMoves(this.swapColor(this._activePlayer))
        .length === 0
    )
  }

  public isStaleMate(): boolean {
    return (
      !this.isKingAttacked(this.swapColor(this._activePlayer)) &&
      this._generateAllPossibleMoves(this.swapColor(this._activePlayer))
        .length === 0
    )
  }

  public getKingPosition(color: Color): number {
    return this._kings[color]
  }
  private _generateAllPossibleMoves(color: Color): Square[] {
    const moves: Square[] = []
    for (let i = Ox88.a8; i <= Ox88.h1; i++) {
      // did we run off the end of the board
      if (i & 0x88) {
        i += 7
        continue
      }
      const piece = this._board[i]
      const startPieceSquare = indexToSquare(i)
      // if empty square or wrong color
      if (piece.type === EMPTY || this._board[i].color !== color) {
        continue
      }

      moves.push(...this.generateMoves(piece, startPieceSquare))
    }

    return moves
  }
  private _privateGenerateMoves(piece: Piece, startSquare: Square): Square[] {
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

    return moves
  }
  public generateMoves(piece: Piece, startSquare: Square): Square[] {
    const sq = Ox88[startSquare]
    const moves: Square[] = []

    if (this.isKingAttacked(piece.color)) {
      return this._generateSafeMoves(piece, startSquare)
    }
    switch (piece.type) {
      case PAWN:
        moves.push(...this._generatePawnMoves(sq, piece.color))
        break
      case KNIGHT:
        moves.push(...this._generateKnightMoves(sq, piece.color))
        break
      case KING:
        moves.push(...this._generateKingMoves(sq, piece.color))
        break
      default:
        moves.push(...this._generateSlidingMoves(sq, piece))
        break
    }

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
      // PROMOTION
      if (rank === 8 || rank === 0) {
      }

      if (rank === 1 || rank === 6) {
        if (offset === 32 || offset === -32) {
          const middleSquare = this._board[startIndex + offset / 2]
          if (targetPiece.type == EMPTY && middleSquare.type === EMPTY) {
            moves.push(indexToSquare(targetIndex))
          }
        }
      }
      if (offset === 16 || offset === -16) {
        if (targetPiece.type == EMPTY) {
          moves.push(indexToSquare(targetIndex))
        }
        continue
      }

      if (Math.abs(offset) === 17 || Math.abs(offset) === 15) {
        if (targetPiece.type !== EMPTY && targetPiece.color !== color) {
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

    if (this._castling[color][KING] && this._canCastleKingSide(color)) {
      moves.push(indexToSquare(startIndex + 2), indexToSquare(startIndex + 3))
    }
    if (this._castling[color][QUEEN] && this._canCastleQueenSide(color)) {
      moves.push(indexToSquare(startIndex - 2), indexToSquare(startIndex - 4))
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
        if (targetPiece.type === EMPTY) {
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

  private _generateSafeMoves(piece: Piece, startSquare: Square): Square[] {
    const moves = this._privateGenerateMoves(piece, startSquare)

    if (piece.type === KING) {
      return moves
    }
    const fromIndex = squareToIndex(startSquare)
    const prevFromPiece = this._board[fromIndex]

    return moves.filter((move) => {
      const toIndex = squareToIndex(move)
      const prevToPiece = this._board[toIndex]

      this._board[toIndex] = piece
      this._board[fromIndex] = { type: 'e' } as Piece

      const isSafe = !this.isKingAttacked(piece.color)

      this._board[fromIndex] = prevFromPiece
      this._board[toIndex] = prevToPiece

      return isSafe
    })
  }

  private _canCastleKingSide(color: Color): boolean {
    const kingIndex = this._kings[color]
    const rookIndex = kingIndex + 3

    if (
      this._board[rookIndex].type !== ROOK ||
      this._board[rookIndex].color !== color
    ) {
      return false
    }

    // Проверяем, что клетки между королем и ладьей свободны
    for (let i = 1; i <= 2; i++) {
      if (this._board[kingIndex + i].type !== 'e') {
        return false
      }
    }

    // Проверяем, что король не проходит через шах
    return (
      !this.isKingAttacked(color) &&
      !this.isAttacked(color, kingIndex + 1) &&
      !this.isAttacked(color, kingIndex + 2)
    )
  }

  private _canCastleQueenSide(color: Color): boolean {
    const kingIndex = this._kings[color]
    const rookIndex = kingIndex - 4

    if (
      this._board[rookIndex].type !== ROOK ||
      this._board[rookIndex].color !== color
    ) {
      return false
    }

    // Проверяем, что клетки между королем и ладьей свободны
    for (let i = 1; i <= 3; i++) {
      if (this._board[kingIndex - i].type !== 'e') {
        return false
      }
    }

    return (
      !this.isKingAttacked(color) &&
      !this.isAttacked(color, kingIndex - 1) &&
      !this.isAttacked(color, kingIndex - 2)
    )
  }

  public isPromotion(piece: Piece, toIndex: number): boolean {
    const rank = getRank(toIndex)
    if (piece.type === PAWN && (rank === 0 || rank === 8)) {
      return true
    }
    return false
  }

  ascii(): string {
    let s = '   +------------------------+\n'
    for (let i = Ox88.a8; i <= Ox88.h1; i++) {
      // display the rank
      if (getFile(i) === 0) {
        s += ' ' + '87654321'[getRank(i)] + ' |'
      }

      if (this._board[i]) {
        const piece = this._board[i].type
        const color = this._board[i].color
        let symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase()
        if (symbol === 'e') {
          symbol = '.'
        }
        s += ' ' + symbol + ' '
      } else {
        s += ' . '
      }

      if ((i + 1) & 0x88) {
        s += '|\n'
        i += 8
      }
    }
    s += '   +------------------------+\n'
    s += '     a  b  c  d  e  f  g  h'

    return s
  }

  public toFen(): string {
    let fen = ''
    let emptyCount = 0
    for (let i = Ox88.a8; i <= Ox88.h1; i++) {
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

    let castlingRights = ''
    if (this._castling[WHITE][KING]) castlingRights += 'K'
    if (this._castling[WHITE][QUEEN]) castlingRights += 'Q'
    if (this._castling[BLACK][KING]) castlingRights += 'k'
    if (this._castling[BLACK][QUEEN]) castlingRights += 'q'
    if (castlingRights === '') castlingRights = '-'
    /* TODO */
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
