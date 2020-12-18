import {CODES, TABLE} from '@core/utils'

function toChar(_, index) {
  return String.fromCharCode(CODES.A + index)
}

const toRowInfo = (rowState, shift=0) => (_, index) => {
  const style = rowState?.[index] ? `style="height: ${rowState[index]}px";` : ''
  return `
    <div 
      class="row-info"
      data-type="resizable"
      data-row="${index + shift}"
      ${style}
    > ${index + 1 + shift}
      <div class="row-resize" data-resize="row"></div>
    </div>
  `
}

const toColInfo = colState => (content, index) => {
  const style = colState?.[index] ? `style="width: ${colState[index]}px";` : ''
  return `
    <div 
      class="col-info"
      data-type="resizable"
      data-col="${index}"
      ${style}
    >
      ${content}
      <div class="col-resize" data-resize="col"></div>
    </div>
  `
}

const toCell = (state, row) => (_, col) => {
  const style = state?.colState?.[col] ?
    `style="width: ${state.colState[col]}px;"` : ''
  const data = state?.dataState?.[`${row}:${col}`] || ''
  const value = data ? `value="${data}"` : ''
  return `
    <input 
      class="cell"
      data-col="${col}"
      data-type="cell"
      data-id="${row}:${col}"
      ${style}
      ${value}
    >
  `
}

const toContainer = content => `<div class="container">${content}</div>`

const toRowsHeader = content => `<div class="rows-header">${content}</div>`

const toColsHeader = content => `<div class="cols-header">${content}</div>`

const toInner = content => `<div class="inner">${content}</div>`

const toRow = (rowState, index, content) => {
  const style = rowState?.[index] ? `style="height: ${rowState[index]}px;"` : ''
  return `
    <div
      class="row"
      data-row="${index}"
      ${style}
    >
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
                          data-type="add-rows-button"
                        >
                          Add
                        </button>
                        <input
                          class="add-rows-widget__input"
                          type="text"
                          value="100"
                          data-type="add-rows-input"
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

export function createTable(state) {
  const {rowsAmount} = state
  if (TABLE.maxHeight !== rowsAmount) {
    TABLE.maxHeight = rowsAmount
  }
  const colsCount = CODES.Z - CODES.A + 1

  const rowInfo = new Array(rowsAmount)
      .fill('')
      .map(toRowInfo(state.rowState)) // setting numbers: 1, 2, 3 ...
      .join('')

  const colInfo = new Array(colsCount)
      .fill('')
      .map(toChar) // setting letters: A, B, C ...
      .map(toColInfo(state.colState))
      .join('')

  const rows = []
  for (let row = 0; row < rowsAmount; row++) {
    const cells = new Array(colsCount)
        .fill('')
        .map(toCell(state, row))
        .join('')
    rows.push(toRow(state.rowState, row, cells))
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

export function addMoreRowsToTable(table) {
  return new Promise(resolve => {
    const state = table.store.getState()
    const lastHeight = state.rowsAmount
    const colsCount = CODES.Z - CODES.A + 1
    const rowsAmount = table.$addRowsInput.numValue
    const rowInfo = new Array(rowsAmount)
        .fill('')
        .map(toRowInfo({}, lastHeight))
        .join('')

    const rows = []
    for (let row = lastHeight; row < lastHeight + rowsAmount; row++) {
      const cells = new Array(colsCount)
          .fill('')
          .map(toCell({}, row))
          .join('')
      rows.push(toRow({}, row, cells))
    }

    table.$rowsHeader.insertHTML(rowInfo)
    table.$inner.insertHTML(rows.join(''))
    table.$addRowsInput.$el.scrollIntoView()
    resolve(rowsAmount)
  })
}
