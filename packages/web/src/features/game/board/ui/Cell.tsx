import React, { useRef } from 'react'
import styled from 'styled-components'
import { useDrop } from 'react-dnd'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { Piece, Square } from '../lib/chess'
import { clearSelection, makeMove, selectPiece } from '../model/slice'
import Figure from './Figure'

const CellContainer = styled.div<{
	isDark: boolean
	isLegalMove?: boolean
	isOver?: boolean
}>`
	width: 75px;
	height: 75px;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	cursor: pointer;
	background-color: ${({ isDark, isOver }) =>
		isOver ? 'rgba(0, 153, 0, 0.58)' : isDark ? '#b58863' : '#f0d9b5'};

	&::after {
		content: '';
		display: ${({ isLegalMove }) => (isLegalMove ? 'flex' : 'none')};
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 25%;
		height: 25%;
		border-radius: 50%;
		background-color: rgba(74, 145, 74, 0.73);
	}
`

interface CellProps {
	piece: Piece | null
	isDark: boolean
	isLegalMove: boolean
	onClick: () => void
	square: Square
}

const Cell: React.FC<CellProps> = ({
	piece,
	isDark,
	isLegalMove,
	onClick,
	square,
}) => {
	const ref = useRef<HTMLDivElement>(null)

	const dispatch = useAppDispatch()

	const [{ isOver }, drop] = useDrop(() => ({
		accept: 'chess-piece',
		drop: (item: { from: Square }) => {
			dispatch(
				/*isLegalMove
					? makeMove({ from: item.from, to: square })
					:*/ makeMove({ from: item.from, to: square })
			)
		},
		collect: monitor => ({
			isOver: monitor.isOver(),
		}),
	}))

	drop(ref)

	return (
		<CellContainer
			ref={ref}
			isDark={isDark}
			isLegalMove={isLegalMove}
			isOver={isOver}
			onClick={onClick}
		>
			{piece && <Figure piece={piece} square={square} />}
		</CellContainer>
	)
}

export default React.memo(Cell)
