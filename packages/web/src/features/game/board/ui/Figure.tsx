import React, { useRef, useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { Piece } from '../model/types'
import { pieceToComponentMap } from '../lib/utils'

interface FigureProps {
	piece: Piece
	position: { x: number; y: number }
}

const Figure: React.FC<FigureProps> = ({ piece, position }) => {
	const ref = useRef<HTMLImageElement>(null)
	const previewRef = useRef<HTMLImageElement | null>(null)

	const [{ isDragging: dndDragging }, drag, preview] = useDrag({
		type: 'chess-piece',
		item: { FromX: position.x, FromY: position.y },
		collect: monitor => ({
			isDragging: monitor.isDragging(),
		}),
	})

	useEffect(() => {
		const img = new Image()
		img.src = pieceToComponentMap[piece]
		img.width = 60
		img.height = 60
		previewRef.current = img

		preview(img, { offsetX: 50, offsetY: 50 })
	}, [piece, preview])

	drag(ref)

	return (
		<img
			ref={ref}
			src={pieceToComponentMap[piece]}
			alt={piece}
			style={{
				opacity: dndDragging ? 0.5 : 1,
				width: '100%',
				height: '100%',
				cursor: dndDragging ? 'grabbing' : 'grab', // Не работает. При взятие нет состояния grabbing
			}}
		/>
	)
}

export default Figure
