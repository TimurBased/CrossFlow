import React, { useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import { useDrag } from 'react-dnd'
import { pieceToComponentMapBase64 } from '@/features/game/board/model/types'
import { Piece, Square } from '../lib/chess'
import { useAppSelector } from '@/hooks/useAppDispatch'

// const FigureStyled = styled.img<{ isDragging: boolean }>`
//   width: 100%;
//   height: 100%;
//   opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
//   cursor: grab;
//   z-index: ${({ isDragging }) => (isDragging ? 10 : 1)};
//   touch-action: none;
//   transition: transform 0.1s ease-in-out;
//   &:active {
//     cursor: grabbing;
//     transform: scale(1.1);
//   }
// `

const FigureStyled = styled.div<{ isDragging: boolean; imageUrl: string }>`
  width: 100%;
  height: 100%;
  opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
  cursor: pointer;
  z-index: ${({ isDragging }) => (isDragging ? 10 : 1)};
  touch-action: none;
  transition: transform 0.1s ease-in-out;
  background: ${({ imageUrl }) => css`url(${imageUrl})`} no-repeat center;
  background-size: contain;
`

interface FigureProps {
  piece: Piece
  square: Square
}

export const Figure: React.FC<FigureProps> = ({ piece, square }) => {
  const ref = useRef<HTMLImageElement>(null)
  const activePlayer = useAppSelector((state) =>
    state.board.game.getActivePlayer()
  )
  const isMyTurn = piece.color === activePlayer

  const [{ isDragging }, drag] = useDrag({
    type: 'piece',
    item: isMyTurn ? { from: square } : null,
    canDrag: isMyTurn,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  useEffect(() => {
    if (ref.current) {
      ref.current.style.opacity = isDragging ? '0.5' : '1'
      ref.current.style.zIndex = isDragging ? '10' : '1'
    }
  }, [isDragging])

  drag(ref)

  return (
    // <FigureStyled
    //   // ref={ref}
    //   src={
    //     pieceToComponentMap[
    //       piece.color === 'b' ? piece.type : piece.type.toUpperCase()
    //     ]
    //   }
    //   alt={piece.type}
    //   isDragging={true}
    // />
    <FigureStyled
      ref={ref}
      imageUrl={
        pieceToComponentMapBase64[
          piece.color === 'b' ? piece.type : piece.type.toUpperCase()
        ]
      }
      isDragging={true}
    />
  )
}
