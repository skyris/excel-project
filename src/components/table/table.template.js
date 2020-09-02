const CODES = {
  A: 65,
  Z: 90,
}

function toCell(el) {
  return `
    <div class="cell" contenteditable>${el}</div> 
  `
}

function toColumn(content) {
  return `
    <div class="column">
      ${content}
      <div class="col-resize"></div>
    </div> 
  `
}

function createRow(index, content) {
  const resize = index ? '<div class="row-resize"></div>' : ''
  return `
    <div class="row">
      <div class="row-info">
        ${index ? index : ''}
        ${resize}
      </div>
      <div class="row-data">${content}</div>
    </div>
  `
}

function toChar(_, index) {
  return String.fromCharCode(CODES.A + index)
}

export function createTable(rowsCount=30) {
  const colsCount = CODES.Z - CODES.A + 1
  const rows = []

  const cols = new Array(colsCount)
      .fill('')
      .map(toChar)
      .map(toColumn)
      .join('')

  rows.push(createRow(null, cols))

  // const cellCols = new Array(colsCount)
  //     .fill('')
  //     .map(toCell)
  //     .join('')

  for (let i = 0; i < rowsCount; i++) {
    const cells = new Array(colsCount)
        .fill('')
        .map(toCell)
        .join('')
    rows.push(createRow(i + 1, cells))
  }

  return rows.join('')
}
