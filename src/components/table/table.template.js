import {CODES, TABLE} from '@core/utils'


function toChar(_, index) {
  return String.fromCharCode(CODES.A + index)
}

const toRowInfo = (_, index) => {
  return `
    <div 
      class="row-info"
      data-type="resizable"
      data-row="${index}"
    > ${index + 1}
      <div class="row-resize" data-resize="row"></div>
    </div>
  `
}

const toColInfo = (content, index) => {
  return `
    <div 
      class="col-info"
      data-type="resizable"
      data-col="${index}"
    >
      ${content}
      <div class="col-resize" data-resize="col"></div>
    </div>
  `
}

const toCell = row => (_, col) => {
  return `
    <div 
      class="cell"
      contenteditable 
      data-col="${col}"
      data-type="cell"
      data-id="${row}:${col}"
    ></div> 
  `
}

const toContainer = content => `<div class="container">${content}</div>`

const toRowsHeader = content => `<div class="rows-header">${content}</div>`

const toColsHeader = content => `<div class="cols-header">${content}</div>`

const toInner = content => `<div class="inner">${content}</div>`

const toRow = (index, content) => {
  return `
    <div
      class="row"
      data-row="${index}">
        ${content}
    </div>
  `
}

const corner = '<div class="corner"></div>'

const rightShim = '<div class="right-shim"></div>'

const endShim = '<div class="end-shim"></div>'

const bottomShim = `<div class="bottom-shim">
                      <div class="add-rows-widget">
                        <button
                          class="add-rows-widget__button"
                        >
                          Add
                        </button>
                        <input
                          class="add-rows-widget__input"
                          type="text"
                          value="100"
                        >
                        <div 
                          class="add-rows-widget__text"
                        >
                          more rows at bottom
                        </div>
                      </div>
                    </div>`

// Hierarchy of html elements in excel table:

// .excel_table
//     .corner
//     .container
//         .rows-header            left
//             .row-info
//                 .row-resize
//             .row-info
//                 .row-resize
//             .row-info
//                 .row-resize
//              ...
//         .cols-header            top
//             .col-info
//                 .col-resize
//             .col-info
//                 .col-resize
//             .col-info
//                 .col-resize
//              ...
//         .inner
//             .row
//                 .cell 0:0
//                 .cell 0:2
//                 .cell 0:3
//             .row
//                 .cell 1:0
//                 .cell 1:2
//                 .cell 1:3
//         .right-shim
//         .bottom-shim
//             .add-rows-widget
//         .end-shim

export function createTable(rowsCount=TABLE.maxHeight) {
  const colsCount = CODES.Z - CODES.A + 1

  const rowInfo = new Array(rowsCount)
      .fill('')
      .map(toRowInfo) // setting numbers: 1, 2, 3 ...
      .join('')

  const colInfo = new Array(colsCount)
      .fill('')
      .map(toChar) // setting letters: A, B, C ...
      .map(toColInfo)
      .join('')

  const rows = []
  for (let row = 0; row < rowsCount; row++) {
    const cells = new Array(colsCount)
        .fill('')
        .map(toCell(row))
        .join('')
    rows.push(toRow(row, cells))
  }

  const inContainer = []
  inContainer.push(
      toRowsHeader(rowInfo),
      toColsHeader(colInfo),
      toInner(rows.join('')),
      rightShim,
      bottomShim,
      endShim
  )

  const inTable = []
  inTable.push(
      corner, toContainer(inContainer.join(''))
  )

  return inTable.join('')
}

