import { Piece } from '../model/types'

export function isEnemyPiece(
	currentPiece: Piece,
	targetPiece: Piece | null
): boolean {
	if (!targetPiece) return true

	const isCurrentWhite = currentPiece === currentPiece.toUpperCase()

	const isTargetWhite = targetPiece === targetPiece.toUpperCase()

	return isCurrentWhite !== isTargetWhite
}
