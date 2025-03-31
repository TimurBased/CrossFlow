import React from 'react'
import styled from 'styled-components'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch'
import { Cell } from './Cell'
import { Square } from 'chess.js'
import { makeMove, selectPiece, clearSelection } from '../model/slice'
import NotationFile from './NotationFile'
import NotationRank from './NotationRank'
import { indexToSquare, squareToIndex } from '../lib/chess'

const BoardWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 10px;
`

const BoardContainer = styled.div`
  display: grid;
  border-radius: 5px;
  overflow: hidden;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);

  /* Размер адаптируется под экран */
  width: min(90vw, 90vh, 750px);
  height: min(90vw, 90vh, 750px);

  /* Гарантируем квадратную форму */
  aspect-ratio: 1 / 1;
  min-width: 280px;
  min-height: 280px;
  position: relative;
`

const Board: React.FC = () => {
  const { game, selectedPiece, legalMoves, isCheck } = useAppSelector(
    (state) => state.board
  )
  const dispatch = useAppDispatch()

  const handleClick = (square: Square) => {
    const clickedPiece = game.getBoard()[squareToIndex(square)]
    if (selectedPiece) {
      if (legalMoves.some((move) => move === square)) {
        dispatch(makeMove({ from: square, to: selectedPiece }))
      } else {
        if (clickedPiece && clickedPiece?.color == game.getActivePlayer()) {
          dispatch(selectPiece(square))
        } else {
          dispatch(clearSelection())
        }
      }
    } else {
      if (clickedPiece && clickedPiece?.color === game.getActivePlayer()) {
        dispatch(selectPiece(square))
      }
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <h2>Player color move: {game.getActivePlayer()}</h2>
      <BoardWrapper>
        <BoardContainer>
          <NotationFile />
          <NotationRank />
          {game
            .getBoard()
            .map((cell, index) => ({ cell, index }))
            .filter(({ cell }) => cell.type !== 'o')
            .map(({ cell, index }, renderIndex) => (
              <Cell
                key={index + 1}
                piece={cell.type === 'e' ? null : cell}
                isLegalMove={legalMoves.some(
                  (move) => move === indexToSquare(index)
                )}
                isDark={
                  ((renderIndex % 8) + Math.floor(renderIndex / 8)) % 2 === 1
                }
                isCheck={
                  isCheck && index === game._kings[game.getActivePlayer()]
                }
                onClick={() => handleClick(indexToSquare(index))}
                square={indexToSquare(index)}
              />
            ))}
        </BoardContainer>
      </BoardWrapper>
    </DndProvider>
  )
}

export default Board
