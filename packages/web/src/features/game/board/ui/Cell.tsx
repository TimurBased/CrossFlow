import React, { useRef } from 'react'
import styled from 'styled-components'
import { useDrop } from 'react-dnd'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { Piece, Square } from '../lib/chess'
import { clearSelection, makeMove } from '../model/slice'
import { Figure } from './Figure'

const IsCheckWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 70%;
  position: absolute;
  z-index: 0;
  background-image: radial-gradient(
    circle,
    rgba(255, 0, 0, 0.6) 50%,
    rgba(255, 0, 0, 0) 70%
  );
`

const CellContainer = styled.div<{
  piece: Piece | null
  isDark: boolean
  isCheck: boolean
  isLegalMove?: boolean
  isOver?: boolean
}>`
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;

  background-color: ${({ isDark, isOver }) =>
    isOver ? 'rgba(20, 85, 30, 0.5)' : isDark ? '#b58863' : '#f0d9b5'};

  &::after {
    content: '';
    display: ${({ isLegalMove }) => (isLegalMove ? 'flex' : 'none')};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 25%;
    height: 25%;
    border-radius: 100%;
    background: ${({ piece }) => (!piece ? 'rgba(20, 85, 30, 0.5)' : 'none')};
    z-index: 2;
  }

  ${({ isLegalMove, piece, isDark, isOver }) =>
    isLegalMove &&
    piece &&
    `
      background: radial-gradient(transparent 1%, transparent 79%, rgba(20, 85, 30, 0.5) 80%);
      background-color: ${
        isOver ? 'rgba(20, 85, 30, 0.5)' : isDark ? '#b58863' : '#f0d9b5'
      };
    `}
`

interface CellProps {
  piece: Piece | null
  isDark: boolean
  isCheck: boolean
  isLegalMove: boolean
  onClick: () => void
  square: Square
}

export const Cell: React.FC<CellProps> = ({
  piece,
  isDark,
  isCheck,
  isLegalMove,
  onClick,
  square,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()

  const [{ isOver }, drop] = useDrop({
    accept: 'PIECE',
    drop: (item: { piece: Piece; fromSquare: Square }) => {
      dispatch(
        makeMove({
          to: square,
          from: item.fromSquare,
        })
      )
      dispatch(clearSelection())
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  drop(ref)

  return (
    <>
      <CellContainer
        piece={piece}
        ref={ref}
        isDark={isDark}
        isLegalMove={isLegalMove}
        isCheck={isCheck}
        isOver={isOver}
        onClick={onClick}
      >
        {piece && <Figure piece={piece} square={square} />}
        {isCheck && <IsCheckWrapper />}
      </CellContainer>
    </>
  )
}
