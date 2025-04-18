import { Move } from './Move'
import {
  ATTACKS,
  BISHOP,
  BLACK,
  Color,
  DEFAULT_POSITION,
  InternalMove,
  KING,
  KNIGHT,
  GAME_STATE,
  Square,
  Ox88,
  PAWN,
  pawnDirectionOffsets,
  Piece,
  PIECE_MASKS,
  pieceDirectionOffsets,
  PieceSymbol,
  QUEEN,
  RAYS,
  ROOK,
  WHITE,
} from './types'
import { getRank, indexToSquare, squareToIndex, swapColor } from './utils'

// TODO
// move generateMoves methods to a separate static class
export class Chess {
  private _board: Piece[] = new Array(128)
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
        this._putPiece({ type: type, color } as Piece, indexToSquare(square))
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

    // TODO: Добавить обработку взятия на проходе и счетчиков ходов
  }

  public getBoard() {
    return [...this._board]
  }

  public getActivePlayer(): Color {
    return this._activePlayer
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

      if (piece == null) {
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

  public MovePiece(from: Square, to: Square): Move | null {
    const fromIndex = squareToIndex(from)
    const toIndex = squareToIndex(to)
    const rank = getRank(toIndex)

    const piece = this._board[fromIndex]
    if (piece.color !== this._activePlayer) return null

    const possibleMoves = this.generateMoves(piece, from)

    if (!possibleMoves.includes(to)) {
      return null
    }

    // promotion move ONLY QUEEN
    // TODO FULL LOGIC
    if (piece.type === PAWN && (rank === 0 || rank === 7)) {
      this._board[toIndex] = { type: QUEEN, color: this._activePlayer } as Piece
      delete this._board[fromIndex]
      this._activePlayer = swapColor(this._activePlayer)
      return new Move({
        fromIndex: fromIndex,
        toIndex: toIndex,
        piece: piece,
        promotion: QUEEN,
      } as InternalMove)
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
      delete this._board[fromIndex]

      // Перемещение ладьи
      this._board[rookTo] = rook
      delete this._board[rookFrom]

      // Отключаем возможность дальнейшей рокировки
      this._castling[piece.color][QUEEN] = false
      this._castling[piece.color][KING] = false
      this._kings[piece.color] = toIndex

      this._activePlayer = swapColor(this._activePlayer)
      return new Move({ fromIndex, toIndex, piece } as InternalMove)
    }

    this._board[toIndex] = piece
    delete this._board[fromIndex]

    if (piece.type === ROOK) {
      if (fromIndex === Ox88.a1 || fromIndex === Ox88.a8) {
        this._castling[piece.color][QUEEN] = false
      }
      if (fromIndex === Ox88.h8 || fromIndex === Ox88.h1) {
        this._castling[piece.color][KING] = false
      }
    }
    if (this.getGameState() !== 'active') {
      return null
    }
    if (piece.type === KING) {
      this._castling[piece.color][QUEEN] = false
      this._castling[piece.color][KING] = false
      this._kings[piece.color] = toIndex
    }
    const move = new Move({ fromIndex, toIndex, piece } as InternalMove)
    this._moveHistory.push(move)

    this._activePlayer = swapColor(this._activePlayer)
    return move
  }

  public generateMoves(piece: Piece, startSquare: Square): Square[] {
    const sq = Ox88[startSquare]
    const moves: Square[] = []

    switch (piece.type) {
      case PAWN:
        moves.push(...this._generatePawnMoves(sq, piece.color))
        break
      case KNIGHT:
        moves.push(...this._generateKnightMoves(sq, piece.color))
        break
      case KING:
        moves.push(...this._generateKingMoves(sq, piece.color))
        return moves

      default:
        moves.push(...this._generateSlidingMoves(sq, piece))
        break
    }

    const fromIndex = squareToIndex(startSquare)

    const pseudoLegal = moves.filter((moveSquare) => {
      const toIndex = squareToIndex(moveSquare)
      const capturedPiece = this._board[toIndex]

      // Выполняем временный ход
      delete this._board[fromIndex]
      this._board[toIndex] = piece

      const isSafe = this.isKingAttacked(piece.color)

      // Откатываем
      delete this._board[toIndex]
      this._board[fromIndex] = piece
      if (capturedPiece) this._board[toIndex] = capturedPiece

      return !isSafe
    })

    return pseudoLegal
  }

  public isKingAttacked(color: Color): boolean {
    const square = this._kings[color]
    return this.isAttacked(swapColor(color), square)
  }
  public isCheck(): boolean {
    return this.isKingAttacked(this._activePlayer)
  }

  public isGameOver(): boolean {
    return this._isGameOver
  }

  public getKingPosition(color: Color): number {
    return this._kings[color]
  }

  public getGameState(): GAME_STATE {
    if (this._isCheckMate()) {
      this._isGameOver = true
      return 'checkmate'
    }
    if (this._isStaleMate()) {
      this._isGameOver = true
      return 'stalemate'
    }
    if (this._isDraw()) {
    }

    return 'active'
  }

  /* PRIVATE METHODS */

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
      if (piece == null || this._board[i].color !== color) {
        continue
      }

      moves.push(...this.generateMoves(piece, startPieceSquare))
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

      if (rank === 1 || rank === 6) {
        if (offset === 32 || offset === -32) {
          const middleSquare = this._board[startIndex + offset / 2]
          if (targetPiece == null && middleSquare === undefined) {
            moves.push(indexToSquare(targetIndex))
          }
        }
      }
      if (offset === 16 || offset === -16) {
        if (targetPiece == null) {
          moves.push(indexToSquare(targetIndex))
        }
        continue
      }

      if (Math.abs(offset) === 17 || Math.abs(offset) === 15) {
        if (targetPiece && targetPiece.color !== color) {
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
        delete this._board[startIndex]

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

        // если пустое поле
        if (targetPiece == null) {
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
      if (this._board[kingIndex + i] != null) {
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
      if (this._board[kingIndex - i] != null) {
        return false
      }
    }

    //Проверяем не атакованы ли клетки между рокировками
    return (
      !this.isKingAttacked(color) &&
      !this.isAttacked(color, kingIndex - 1) &&
      !this.isAttacked(color, kingIndex - 2)
    )
  }

  private _putPiece({ type, color }: Piece, square: Square): boolean {
    // check for piece
    if ('pnbrqkPNBRQK'.indexOf(type.toLowerCase()) === -1) {
      return false
    }

    // check for valid square
    if (!(square in Ox88)) {
      return false
    }

    const sq = Ox88[square]

    this._board[sq] = { type: type, color: color as Color }

    if (type === KING) {
      this._kings[color] = sq
    }

    return true
  }

  private isAttacked(color: Color, square: number): boolean {
    for (let i = Ox88.a8; i <= Ox88.h1; i++) {
      // did we run off the end of the board
      if (i & 0x88) {
        i += 7
        continue
      }

      // if empty square or wrong color
      if (this._board[i] === undefined || this._board[i].color !== color) {
        continue
      }

      const piece = this._board[i]
      const difference = i - square

      // skip - to/from square are the same
      if (difference === 0) {
        continue
      }

      const index = difference + 119

      if (ATTACKS[index] & PIECE_MASKS[piece.type]) {
        if (piece.type === PAWN) {
          if (
            (difference > 0 && piece.color === WHITE) ||
            (difference <= 0 && piece.color === BLACK)
          ) {
            return true
          }
          continue
        }

        // if the piece is a knight or a king
        if (piece.type === 'n' || piece.type === 'k') {
          return true
        }

        const offset = RAYS[index]
        let j = i + offset

        let blocked = false
        while (j !== square) {
          if (this._board[j] != null) {
            blocked = true
            break
          }
          j += offset
        }

        if (!blocked) {
          return true
        }
      }
    }

    return false
  }

  private _isCheckMate(): boolean {
    return (
      this.isKingAttacked(swapColor(this._activePlayer)) &&
      this._generateAllPossibleMoves(swapColor(this._activePlayer)).length === 0
    )
  }

  private _isStaleMate(): boolean {
    return (
      !this.isKingAttacked(swapColor(this._activePlayer)) &&
      this._generateAllPossibleMoves(swapColor(this._activePlayer)).length === 0
    )
  }
  private _isDraw(): boolean {
    //ПРОВЕРИТЬ ПРАВИЛО 50 ПОЛУХОДОВ
    //ПРОВЕРИТЬ ПРАВИЛО 3 ОДИНАКОВЫХ ПОЗИЦИЙ
    return this.isInsufficientMaterial()
  }

  private isInsufficientMaterial(): boolean {
    /*
     * k.b. vs k.b. (of opposite colors) with mate in 1:
     * 8/8/8/8/1b6/8/B1k5/K7 b - - 0 1
     *
     * k.b. vs k.n. with mate in 1:
     * 8/8/8/8/1n6/8/B7/K1k5 b - - 2 1
     */
    const pieces: Record<PieceSymbol, number> = {
      b: 0,
      n: 0,
      r: 0,
      q: 0,
      k: 0,
      p: 0,
    }
    const bishops = []
    let numPieces = 0
    let squareColor = 0

    for (let i = Ox88.a8; i <= Ox88.h1; i++) {
      squareColor = (squareColor + 1) % 2
      if (i & 0x88) {
        i += 7
        continue
      }

      const piece = this._board[i]
      if (piece) {
        pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1
        if (piece.type === BISHOP) {
          bishops.push(squareColor)
        }
        numPieces++
      }
    }

    // k vs. k
    if (numPieces === 2) {
      return true
    } else if (
      // k vs. kn .... or .... k vs. kb
      numPieces === 3 &&
      (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)
    ) {
      return true
    } else if (numPieces === pieces[BISHOP] + 2) {
      // kb vs. kb where any number of bishops are all on the same color
      let sum = 0
      const len = bishops.length
      for (let i = 0; i < len; i++) {
        sum += bishops[i]
      }
      if (sum === 0 || sum === len) {
        return true
      }
    }

    return false
  }

  // public isPromotion(piece: Piece, toIndex: number): boolean {
  //   const rank = getRank(toIndex)
  //   if (piece.type === PAWN && (rank === 0 || rank === 8)) {
  //     return true
  //   }
  //   return false
  // }
}
