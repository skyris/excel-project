export function shouldResize(event) {
  return event.target.dataset.resize
}
export const isCell = event => event.target.dataset.type === 'cell'


// export function matrix($firstCell, $secondCell) {
//   const [rowStart, colStart] = $firstCell.id()
//   const [rowEnd, colEnd] = $secondCell.id()
//   const [minCol, maxCol] = getMinAndMax(colStart, colEnd)
//   const [minRow, maxRow] = getMinAndMax(rowStart, rowEnd)
// }
