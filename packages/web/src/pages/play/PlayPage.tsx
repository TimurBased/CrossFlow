import React from 'react'
import Board from '@/features/game/ui/Board'
import { DndProvider } from 'react-dnd'
import { TouchBackend } from 'react-dnd-touch-backend'
import { HTML5Backend } from 'react-dnd-html5-backend'

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
export const PlayPage: React.FC = () => {
  return (
    <>
      <h1>This Play page</h1>
      <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
        <Board />
      </DndProvider>
    </>
  )
}
