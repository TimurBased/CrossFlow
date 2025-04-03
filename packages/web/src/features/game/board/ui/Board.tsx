import React from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch'
import { Cell } from './Cell'
import { Square } from 'chess.js'
import { makeMove, selectPiece, clearSelection } from '../model/slice'
import NotationFile from './NotationFile'
import NotationRank from './NotationRank'
import { indexToSquare, squareToIndex } from '../lib/chess'
import { DragPreviewLayer } from './DragPreview'
import { PromotionWindow } from './PromotionWindow'

const BoardWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  user-select: none;
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
  const {
    game,
    selectedPiece,
    legalMoves,
    isCheck,
    gameState,
    promotionWindow,
  } = useAppSelector((state) => state.board)
  const dispatch = useAppDispatch()

  const handleClick = (square: Square) => {
    const clickedPiece = game.getBoard()[squareToIndex(square)]

    if (selectedPiece) {
      // Если фигура уже выбрана
      if (legalMoves.some((move) => move === square)) {
        // Если клик был на легальную клетку, совершаем ход
        dispatch(makeMove({ from: selectedPiece, to: square }))
        dispatch(clearSelection()) // Очищаем выбор после хода
      } else {
        // Если клик был на другую свою фигуру, обновляем выбор
        if (clickedPiece && clickedPiece.color === game.getActivePlayer()) {
          dispatch(selectPiece(square))
        } else {
          // Если клик был на пустую клетку или чужую фигуру, но ход нелегален, очищаем выбор
          dispatch(clearSelection())
        }
      }
    } else {
      // Если фигура еще не выбрана
      if (clickedPiece && clickedPiece.color === game.getActivePlayer()) {
        // Выбираем фигуру, если клик был по своей фигуре
        dispatch(selectPiece(square))
      }
    }
  }

  return (
    <>
      <h3>Player color move: {game.getActivePlayer()}</h3>
      <h3>Game state: {gameState}</h3>
      {/* {promotionWindow && <PromotionWindow />} */}
      <PromotionWindow />
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
                  isCheck &&
                  index === game.getKingPosition(game.getActivePlayer())
                }
                onClick={() => handleClick(indexToSquare(index))}
                square={indexToSquare(index)}
              />
            ))}
        </BoardContainer>
      </BoardWrapper>
      <DragPreviewLayer />
    </>
  )
}

export default Board
