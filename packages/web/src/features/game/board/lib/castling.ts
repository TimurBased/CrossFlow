import { BoardState } from '../model/types'

export function canCastle(
	board: BoardState,
	fen: string,
	fromX: number,
	fromY: number,
	toX: number,
	isKingSide: boolean,
	isWhite: boolean
): boolean {
	const kingRow = isWhite ? 7 : 0
	const rookCol = isKingSide ? 7 : 0

	// Проверяем, что король и ладья не двигались
	if (!hasMoved(fen, isWhite)) {
		return false
	}

	// Проверяем, что между королём и ладьёй нет других фигур
	if (!isPathClear(board, fromX, fromY, rookCol, kingRow)) {
		return false
	}

	// Проверяем, что король не находится под шахом
	if (isUnderAttack(fromX, fromY, board, isWhite ? 'b' : 'w')) {
		return false
	}

	// Проверяем, что король не проходит через атакуемые клетки
	const step = isKingSide ? 1 : -1
	for (let x = fromX + step; x !== toX; x += step) {
		if (isUnderAttack(x, fromY, board, isWhite ? 'b' : 'w')) {
			return false
		}
	}

	return true
}

// Проверяет, двигалась ли фигура ранее
function hasMoved(fen: string, isWhite: boolean): boolean {
	const fenCastlingPart = fen.split(' ')[2]
	if (isWhite) {
		if (fenCastlingPart[0] !== '-' || fenCastlingPart[1] !== '-') {
			return true
		}
	} else if (fenCastlingPart[2] !== '-' || fenCastlingPart[3] !== '-') {
		return true
	}
	return false
}

// Проверяет, свободен ли путь между королём и ладьёй
function isPathClear(
	board: BoardState,
	fromX: number,
	fromY: number,
	toX: number,
	toY: number
): boolean {
	const step = fromX < toX ? 1 : -1
	for (let x = fromX + step; x !== toX; x += step) {
		if (board[fromY][x] !== null) {
			return false
		}
	}
	return true
}

// Проверяет, находится ли клетка под атакой
function isUnderAttack(
	x: number,
	y: number,
	board: BoardState,
	opponentColor: string
): boolean {
	// Реализация зависит от того, как вы проверяете атаку
	// Например, можно перебрать все фигуры противника и проверить их ходы
	return false // Заглушка
}

export const kingSpecialMoves = (
	board: BoardState,
	isWhite: boolean,
	fromX: number,
	fromY: number,
	toX: number,
	toY: number
): BoardState => {
	// Создаём копию доски
	const newBoard = board.map(row => [...row])

	if (isWhite) {
		// *** castling ***
		// Короткая рокировка (0-0)
		if (fromY === 7 && fromX === 4 && toY === 7 && toX === 6) {
			// Перемещаем короля
			newBoard[7][6] = 'K'
			newBoard[7][4] = null

			// Перемещаем ладью
			newBoard[7][5] = 'R'
			newBoard[7][7] = null

			console.log(newBoard)
			return newBoard
		}
		// Длинная рокировка (0-0-0)
		if (fromY === 7 && fromX === 4 && toY === 7 && toX === 2) {
			// Перемещаем короля
			newBoard[7][2] = 'K'
			newBoard[7][4] = null

			// Перемещаем ладью
			newBoard[7][3] = 'R'
			newBoard[7][0] = null

			return newBoard
		}
	} else if (!isWhite) {
		// Короткая рокировка (0-0)
		if (fromY === 0 && fromX === 4 && toY === 0 && toX === 6) {
			// Перемещаем короля
			newBoard[0][6] = 'k'
			newBoard[0][4] = null

			// Перемещаем ладью
			newBoard[0][5] = 'r'
			newBoard[0][7] = null

			return newBoard
		}
		// Длинная рокировка (0-0-0)
		if (fromY === 0 && fromX === 4 && toY === 0 && toX === 2) {
			// Перемещаем короля
			newBoard[0][2] = 'k'
			newBoard[0][4] = null

			// Перемещаем ладью
			newBoard[0][3] = 'r'
			newBoard[0][0] = null

			return newBoard
		}
	}
	return newBoard
}
