import React, { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Piece, Square } from '../lib/chess'
import { pieceToComponentMapBase64 } from '@/features/game/board/model/types'
import { useDrag } from 'react-dnd'

const FigureStyled = styled.div<{ imageUrl: string; isDragging: boolean }>`
  width: 100%;
  height: 100%;
  cursor: grab;
  touch-action: none;
  background: ${({ imageUrl }) => `url(${imageUrl})`} no-repeat center;
  background-size: contain;
  z-index: 10;
  opacity: ${({ isDragging }) => (isDragging ? '0.5' : '1')};
`

interface FigureProps {
  piece: Piece
  square: Square
}

export const Figure: React.FC<FigureProps> = ({ piece, square }) => {
  const imageUrl =
    pieceToComponentMapBase64[
      piece.color === 'b' ? piece.type : piece.type.toUpperCase()
    ]
  const ref = useRef<HTMLDivElement>(null)
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'PIECE',
    item: { piece, fromSquare: square },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  drag(ref)

  useEffect(() => {
    preview(document.createElement('div'))
  }, [preview])

  return <FigureStyled ref={ref} imageUrl={imageUrl} isDragging={isDragging} />
}
