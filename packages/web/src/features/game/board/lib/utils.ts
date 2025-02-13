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

import { BoardState, Piece } from '../model/types'

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

export function isValidMove(
	type: Piece,
	fromX: number,
	fromY: number,
	toX: number,
	toY: number,
	board: BoardState
): boolean {
	switch (type) {
		case 'P':
		case 'p':
			return pawnMove(type, fromX, fromY, toX, toY, board)
		case 'N':
		case 'n':
			return knightMove(type, fromX, fromY, toX, toY, board)
		case 'B':
		case 'b':
			return bishopMove(type, fromX, fromY, toX, toY, board)
		case 'R':
		case 'r':
			return rookMove(type, fromX, fromY, toX, toY, board)
		case 'Q':
		case 'q':
			return queenMove(type, fromX, fromY, toX, toY, board)
		case 'K':
		case 'k':
			return kingMove(type, fromX, fromY, toX, toY, board)
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

	const targetPiece = board[toY][toX]

	if (!isEnemyPiece(type, targetPiece)) {
		return false
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

	// Получаем фигуру, стоящую на целевой клетке
	const targetPiece = board[toY][toX] // Y - строки, X - столбцы

	if (!isEnemyPiece(type, targetPiece)) {
		return false
	}
	return true
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
	board: BoardState
): boolean {
	if (Math.abs(fromX - toX) <= 1 && Math.abs(fromY - toY) <= 1) {
		const targetPiece = board[toY][toX]

		if (!isEnemyPiece(type, targetPiece)) {
			return false
		}
		return true
	}
	return false
}

function isEnemyPiece(currentPiece: Piece, targetPiece: Piece | null): boolean {
	if (!targetPiece) return true

	const isCurrentWhite = currentPiece === currentPiece.toUpperCase()

	const isTargetWhite = targetPiece === targetPiece.toUpperCase()

	return isCurrentWhite !== isTargetWhite
}
