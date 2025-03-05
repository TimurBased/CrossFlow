import { BoardState, Piece } from '../model/types'
import { isEnemyPiece } from './isEnemyPiece'
import { canCastle } from './castling'

export function isValidMove(
	piece: Piece,
	board: BoardState,
	fen: string,
	fromX: number,
	fromY: number,
	toX: number,
	toY: number
): boolean {
	switch (piece) {
		case 'P':
		case 'p':
			return pawnMove(piece, fromX, fromY, toX, toY, board)
		case 'N':
		case 'n':
			return knightMove(piece, fromX, fromY, toX, toY, board)
		case 'B':
		case 'b':
			return bishopMove(piece, fromX, fromY, toX, toY, board)
		case 'R':
		case 'r':
			return rookMove(piece, fromX, fromY, toX, toY, board)
		case 'Q':
		case 'q':
			return queenMove(piece, fromX, fromY, toX, toY, board)
		case 'K':
		case 'k':
			return kingMove(piece, fromX, fromY, toX, toY, board, fen)
		default:
			console.log('move is default')
			return false
	}
}

function pawnMove(
	type: 'P' | 'p',
	fromX: number,
	fromY: number,
	toX: number,
	toY: number,
	board: BoardState
): boolean {
	const direction = type === 'P' ? -1 : 1

	// Прямой ход на одну клетку вперед
	if (
		fromX === toX &&
		fromY + direction === toY &&
		!board[fromY + direction][fromX]
	) {
		return true
	}

	// Двойной ход с начальной позиции
	if (
		fromX === toX &&
		fromY === (type === 'P' ? 6 : 1) &&
		fromY + 2 * direction === toY &&
		!board[fromY + 2 * direction][fromX] &&
		!board[fromY + direction][fromX]
	) {
		return true
	}

	if (
		Math.abs(toX - fromX) === 1 &&
		toY === fromY + direction &&
		board[toY][toX] !== null &&
		isEnemyPiece(type, board[toY][toX])
	) {
		return true
	}
	// TODO
	// Эпсилон ход

	return false
}

function knightMove(
	type: Piece,
	fromX: number,
	fromY: number,
	toX: number,
	toY: number,
	board: BoardState
): boolean {
	// Проверяем, является ли ход коня валидным
	const isKnightMove =
		(Math.abs(fromX - toX) === 2 && Math.abs(fromY - toY) === 1) ||
		(Math.abs(fromX - toX) === 1 && Math.abs(fromY - toY) === 2)

	if (!isKnightMove) {
		return false
	}

	return !board[toY][toX] || isEnemyPiece(type, board[toY][toX])
}

function bishopMove(
	type: Piece,
	fromX: number,
	fromY: number,
	toX: number,
	toY: number,
	board: BoardState
): boolean {
	if (Math.abs(fromX - toX) !== Math.abs(fromY - toY)) return false

	const dx = Math.sign(toX - fromX)
	const dy = Math.sign(toY - fromY)

	for (let i = 1; i < Math.abs(toX - fromX); i++) {
		if (board[fromY + i * dy][fromX + i * dx]) return false
	}
	// Получаем фигуру, стоящую на целевой клетке
	const targetPiece = board[toY][toX]

	if (!isEnemyPiece(type, targetPiece)) {
		return false
	}
	return true
}

function rookMove(
	type: Piece,
	fromX: number,
	fromY: number,
	toX: number,
	toY: number,
	board: BoardState
): boolean {
	if (fromX !== toX && fromY !== toY) return false

	const dx = fromX === toX ? 0 : Math.sign(toX - fromX)
	const dy = fromY === toY ? 0 : Math.sign(toY - fromY)

	for (
		let i = 1;
		i < Math.max(Math.abs(toX - fromX), Math.abs(toY - fromY));
		i++
	) {
		if (board[fromY + i * dy][fromX + i * dx]) return false
	}

	// Получаем фигуру, стоящую на целевой клетке
	const targetPiece = board[toY][toX]

	if (!isEnemyPiece(type, targetPiece)) {
		return false
	}
	return true
}

function queenMove(
	type: Piece,
	fromX: number,
	fromY: number,
	toX: number,
	toY: number,
	board: BoardState
): boolean {
	return (
		bishopMove(type, fromX, fromY, toX, toY, board) ||
		rookMove(type, fromX, fromY, toX, toY, board)
	)
}

function kingMove(
	type: Piece,
	fromX: number,
	fromY: number,
	toX: number,
	toY: number,
	board: BoardState,
	fen: string
): boolean {
	// Обычный ход короля
	if (Math.abs(fromX - toX) <= 1 && Math.abs(fromY - toY) <= 1) {
		const targetPiece = board[toY][toX]

		if (!isEnemyPiece(type, targetPiece)) {
			return false
		}
		return true
	}

	// Проверка рокировки
	if (type === 'K' || type === 'k') {
		const isWhite = type === 'K'
		const kingRow = isWhite ? 7 : 0

		// Короткая рокировка (король перемещается на две клетки вправо)
		if (
			fromX === 4 &&
			fromY === kingRow &&
			toX === 6 &&
			toY === kingRow &&
			canCastle(board, fen, fromX, fromY, toX, true, isWhite)
		) {
			return true
		}

		// Длинная рокировка (король перемещается на две клетки влево)
		if (
			fromX === 4 &&
			fromY === kingRow &&
			toX === 2 &&
			toY === kingRow &&
			canCastle(board, fen, fromX, fromY, toX, false, isWhite)
		) {
			return true
		}
	}

	return false
}
