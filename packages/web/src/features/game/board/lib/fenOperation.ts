import { BoardState } from '../model/types'

export function boardToFen(board: BoardState, activePlayer: 'w' | 'b'): string {
	let newFen = board
		.map(row =>
			row
				.map(cell => (cell ? cell : '1'))
				.join('')
				.replace(/1+/g, match => match.length.toString())
		)
		.join('/')

	return `${newFen} ${activePlayer} ${'KQkq'}`
}
export function fenToBoard(fen: string): BoardState {
	let newBoard = fen
		.split(' ')[0]
		.split('/')
		.map(row =>
			row
				.match(/(\d+|[PNBRQKpnbrqk])/g)!
				.flatMap(item =>
					isNaN(Number(item)) ? item : Array(Number(item)).fill(null)
				)
		)

	return newBoard
}
