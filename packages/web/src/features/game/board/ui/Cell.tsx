import React, { useRef } from 'react'
import styled from 'styled-components'
import Figure from './Figure'
import { useDrop } from 'react-dnd'
import { movePiece, clearSelection } from '../model/slice'
import { useAppDispatch } from '@/hooks/useAppDispatch'

interface CellProps {
	piece: string | null
	isDark: boolean
	isLegalMove: boolean
	onClick: () => void
	position: { x: number; y: number }
	activePlayer: 'w' | 'b'
}

const CellContainer = styled.div<{
	isLegalMove?: boolean
	isDark: boolean
	isOver?: boolean
	activePlayer: 'w' | 'b'
	piece: string | null
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

const Cell: React.FC<CellProps> = ({
	piece,
	isDark,
	isLegalMove,
	onClick,
	position,
	activePlayer,
}) => {
	const ref = useRef<HTMLImageElement>(null)

	const dispatch = useAppDispatch()

	const [{ isOver }, drop] = useDrop(
		() => ({
			accept: 'chess-piece',
			drop: (item: { FromX: number; FromY: number }) => {
				dispatch(
					isLegalMove
						? movePiece({
								FromX: item.FromX,
								FromY: item.FromY,
								toX: position.x,
								toY: position.y,
						  })
						: clearSelection()
				)
			},
			collect: monitor => ({
				isOver: monitor.isOver(),
			}),
		}),
		[dispatch, isLegalMove, position]
	)

	//КОСТЫЛЬ
	drop(ref)

	return (
		<CellContainer
			ref={ref}
			piece={piece}
			isDark={isDark}
			isLegalMove={isLegalMove}
			isOver={isOver}
			activePlayer={activePlayer}
			onClick={onClick}
		>
			{piece && <Figure piece={piece} position={position} />}
		</CellContainer>
	)
}

export default React.memo(Cell)
