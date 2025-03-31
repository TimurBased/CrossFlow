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
    z-index: 2;
  }
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
    accept: 'piece',
    canDrop: () => isLegalMove,
    drop: (item: { from: Square }, monitor) => {
      if (!monitor.didDrop()) {
        dispatch(makeMove({ from: item.from, to: square }))
        dispatch(clearSelection())
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  drop(ref)

  return (
    <CellContainer
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
  )
}
