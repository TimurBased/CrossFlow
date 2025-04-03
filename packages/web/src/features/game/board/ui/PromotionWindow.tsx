import { useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { pieceToComponentMapBase64 } from '@/features/game/board/model/types'

const ModalOverlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3); /* Улучшенная тень */
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  border-radius: 10px;
  min-width: auto;
  min-height: auto;
`

const CloseButton = styled.button`
  background: none;
  display: block;
  width: 10vh;
  height: 3vh;

  border: none;
  font-size: 20px;
  cursor: pointer;

  transition: 0.2s;

  &:hover {
    color: red;
    background-color: rgb(185, 185, 185);
  }
`

const PieceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const PieceOption = styled.div<{ bgImage: string }>`
  width: 10vh;
  height: 10vh;
  background-image: url(${(props) => props.bgImage});
  background-size: cover;
  cursor: pointer;
  transition: 0.2s;
  min-width: 1vh;
  min-height: 1vh;

  &:hover {
    transform: scale(1.1);
  }
`

const OpenButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  transition: 0.3s;

  &:hover {
    background: #0056b3;
  }
`

export const PromotionWindow: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <OpenButton onClick={() => setIsOpen(true)}>Выбрать фигуру</OpenButton>
      {isOpen &&
        createPortal(
          <ModalOverlay>
            <PieceContainer>
              {['Q', 'R', 'B', 'N'].map((piece) => (
                <PieceOption
                  key={piece}
                  bgImage={pieceToComponentMapBase64[piece]}
                  onClick={() => {}}
                />
              ))}
            </PieceContainer>
            <CloseButton onClick={() => setIsOpen(false)}>✖</CloseButton>
          </ModalOverlay>,
          document.body
        )}
    </>
  )
}
