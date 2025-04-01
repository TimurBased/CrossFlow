import React, { useRef } from 'react'
import styled from 'styled-components'
import { useDrag } from 'react-dnd'
import { Piece, Square } from '../lib/chess'
import { pieceToComponentMapBase64 } from '@/features/game/board/model/types'
import { getEmptyImage } from 'react-dnd-html5-backend'

// Стилизованный компонент для фигур
const FigureStyled = styled.div<{ isDragging: boolean; imageUrl: string }>`
  width: 100%;
  height: 100%;
  cursor: grab;
  touch-action: none;
  background: ${({ imageUrl }) => `url(${imageUrl})`} no-repeat center;
  background-size: contain;
  opacity: ${({ isDragging }) => (isDragging ? 0.6 : 1)};
  z-index: ${({ isDragging }) => (isDragging ? 10 : 1)};
`

interface FigureProps {
  piece: Piece
  square: Square
}

export const Figure: React.FC<FigureProps> = ({ piece, square }) => {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: 'PIECE',
    item: { piece, fromSquare: square },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  // Выключаем превью по умолчанию
  React.useEffect(() => {
    dragPreview(getEmptyImage(), { captureDraggingState: true })
  }, [])

  drag(ref)

  return (
    <FigureStyled
      ref={ref}
      imageUrl={
        pieceToComponentMapBase64[
          piece.color === 'b' ? piece.type : piece.type.toUpperCase()
        ]
      }
      isDragging={isDragging}
    />
  )
}
