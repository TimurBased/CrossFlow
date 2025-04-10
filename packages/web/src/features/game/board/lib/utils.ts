import { BLACK, Color, Ox88, Square, WHITE } from './types'

export function squareToIndex(square: Square): number {
  return Ox88[square]
}

export function indexToSquare(index: number): Square {
  const f = getFile(index)
  const r = getRank(index)
  return ('abcdefgh'.substring(f, f + 1) +
    '87654321'.substring(r, r + 1)) as Square
}

export function getFile(index: number): number {
  return index & 0xf
}

export function getRank(index: number): number {
  return index >> 4
}

export function swapColor(color: Color): Color {
  return color === WHITE ? BLACK : WHITE
}
