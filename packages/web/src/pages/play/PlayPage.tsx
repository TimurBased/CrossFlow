import React from 'react'
import Board from '../../features/game/board/ui/Board'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { SideBar } from '../../shared/components/SideBar'
export const PlayPage: React.FC = () => {
	return (
		<>
			{/* <SideBar></SideBar> */}
			<h1>This Play page</h1>
			<DndProvider backend={HTML5Backend}>
				<Board />
			</DndProvider>
		</>
	)
}
