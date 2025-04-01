import { useDragLayer } from 'react-dnd'
import styled from 'styled-components'
import { pieceToComponentMapBase64 } from '@/features/game/board/model/types'
import { Piece } from '../lib/chess'

// Устанавливаем размер превью фигуры (должен совпадать с реальной фигурой на доске)
const FIGURE_SIZE = 160 // Подстрой под твои размеры клеток

const DragPreview = styled.div<{ imageUrl: string; x: number; y: number }>`
  position: fixed;
  pointer-events: none;
  left: ${({ x }) => `${x - FIGURE_SIZE / 2}px`}; /* Центрируем */
  top: ${({ y }) => `${y - FIGURE_SIZE / 2}px`}; /* Центрируем */
  width: ${FIGURE_SIZE}px;
  height: ${FIGURE_SIZE}px;
  background: ${({ imageUrl }) => `url(${imageUrl})`} no-repeat center;
  background-size: contain;
  z-index: 100;
  opacity: 0.9;
  filter: drop-shadow(2px 2px 6px rgba(0, 0, 0, 0.4));
  transition: transform 0.05s ease-out;
`

export const DragPreviewLayer = () => {
  const { item, isDragging, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
  }))

  if (!isDragging || !currentOffset || !item) return null

  const { piece }: { piece: Piece } = item
  const imageUrl =
    pieceToComponentMapBase64[
      piece.color === 'b' ? piece.type : piece.type.toUpperCase()
    ]

  return (
    <DragPreview
      imageUrl={imageUrl}
      x={currentOffset.x + 50}
      y={currentOffset.y}
    />
  )
}
