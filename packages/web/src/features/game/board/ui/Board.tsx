import React from 'react'
import styled from 'styled-components'
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch'
import { Cell } from './Cell'
import { Square } from 'chess.js'
import { makeMove, selectPiece, clearSelection } from '../model/slice'
import NotationFile from './NotationFile'
import NotationRank from './NotationRank'
import { indexToSquare, squareToIndex } from '../lib/utils'
import { DragPreviewLayer } from './DragPreview'

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
    // promotionWindow,
  } = useAppSelector((state) => state.board)
  const dispatch = useAppDispatch()

  const board = game.getBoard()
  const activePlayer = game.getActivePlayer()

  const handleClick = (square: Square) => {
    const clickedPiece = board[squareToIndex(square)]
    if (selectedPiece) {
      // Если фигура уже выбрана
      if (legalMoves.some((move) => move === square)) {
        // Если клик был на легальную клетку, совершаем ход
        dispatch(makeMove({ from: selectedPiece, to: square }))
        dispatch(clearSelection()) // Очищаем выбор после хода
      } else {
        // Если клик был на другую свою фигуру, обновляем выбор
        if (clickedPiece && clickedPiece.color === activePlayer) {
          dispatch(selectPiece(square))
        } else {
          // Если клик был на пустую клетку или чужую фигуру, но ход нелегален, очищаем выбор
          dispatch(clearSelection())
        }
      }
    } else {
      // Если фигура еще не выбрана
      if (clickedPiece && clickedPiece.color === activePlayer) {
        // Выбираем фигуру, если клик был по своей фигуре
        dispatch(selectPiece(square))
      }
    }
  }

  return (
    <>
      <h3>Player color move: {activePlayer}</h3>
      <h3>Game state: {gameState}</h3>

      <BoardWrapper>
        <BoardContainer>
          <NotationFile />
          <NotationRank />
          {board
            .map((cell, index) => ({ cell, index }))
            .filter(({ index }) => (index & 0x88) === 0)
            .map(({ cell, index }, renderIndex) => {
              const square = indexToSquare(index)
              return (
                <Cell
                  key={index}
                  piece={cell ? cell : null}
                  isLegalMove={legalMoves.some((move) => move === square)}
                  isDark={
                    ((renderIndex % 8) + Math.floor(renderIndex / 8)) % 2 === 1
                  }
                  isCheck={
                    isCheck && index === game.getKingPosition(activePlayer)
                  }
                  onClick={() => handleClick(square)}
                  square={square}
                />
              )
            })}
        </BoardContainer>
      </BoardWrapper>
      <DragPreviewLayer />
    </>
  )
}

export default Board
