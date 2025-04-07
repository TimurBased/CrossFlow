import { useDragLayer } from 'react-dnd'
import styled from 'styled-components'
import { pieceToComponentMapBase64 } from '@/features/game/board/model/types'

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
const FIGURE_SIZE = isMobile ? 100 : 100
const DragPreview = styled.div<{
  x: number
  y: number
  imageUrl: string
  size: number
}>`
  position: fixed;
  pointer-events: none;
  width: ${({ size }) => `${size}`}px;
  height: ${({ size }) => `${size}`}px;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
  background: ${({ imageUrl }) => `url(${imageUrl})`} no-repeat center;
  background-size: contain;
  z-index: 1000;
  filter: drop-shadow(0 0 6px rgba(0, 0, 0, 0.4));
`

export const DragPreviewLayer = () => {
  const { item, isDragging, clientOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    clientOffset: monitor.getClientOffset(),
  }))

  if (!isDragging || !clientOffset || !item?.piece) {
    return null
  }

  const imageUrl =
    pieceToComponentMapBase64[
      item.piece.color === 'b' ? item.piece.type : item.piece.type.toUpperCase()
    ]

  return (
    <DragPreview
      size={FIGURE_SIZE}
      imageUrl={imageUrl}
      x={clientOffset.x - (isMobile ? 50 : 50)}
      y={clientOffset.y - (isMobile ? 50 + 50 : 50)}
    />
  )
}
