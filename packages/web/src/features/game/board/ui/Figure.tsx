import React, { useRef } from 'react'
import styled from 'styled-components'
import { useDrag } from 'react-dnd'
import { useAppSelector } from '@/hooks/useAppDispatch'
import { Piece, Square } from '../lib/chess'

import { pieceToComponentMapBase64 } from '@/features/game/board/model/types'

const FigureStyled = styled.div<{ isDragging: boolean; imageUrl: string }>`
  width: 100%;
  height: 100%;
  opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
  cursor: grab;
  z-index: ${({ isDragging }) => (isDragging ? 10 : 1)};

  touch-action: none;
  transition: transform 0.1s ease-in-out;
  background: ${({ imageUrl }) => `url(${imageUrl})`} no-repeat center;
  background-size: contain;
  &:active {
    cursor: grabbing;
    transform: scale(1.1);
  }
`

interface FigureProps {
  piece: Piece
  square: Square
}

export const Figure: React.FC<FigureProps> = ({ piece, square }) => {
  const ref = useRef<HTMLDivElement>(null)
  const activePlayer = useAppSelector((state) =>
    state.board.game.getActivePlayer()
  )
  const isMyTurn = piece.color === activePlayer

  const [{ isDragging }, drag] = useDrag({
    type: 'piece',
    item: { from: square, piece },
    canDrag: isMyTurn,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

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
