import {CODES} from '@core/utils'

function toCell(el, index) {
  return `
    <div 
      class="cell"
      contenteditable 
      data-col="${index + 1}"
    >
        ${el}
    </div> 
  `
}

function toColumn(content, index) {
  return `
    <div class="column" data-type="resizable" data-col="${index + 1}">
      ${content}
      <div class="col-resize" data-resize="col"></div>
    </div> 
  `
}

function createRow(index, content) {
  const resize = index ? '<div class="row-resize" data-resize="row"></div>' : ''
  return `
    <div class="row" data-type="resizable">
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
