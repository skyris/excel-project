import {$} from '@core/dom'
import {getMinAndMax} from '@core/utils'

const RESIZABLE = '[data-type="resizable"]'
const SELECTED = 'selected'
const CELL = 'cell'
const ROW = 'row'
const ROW_INFO = 'row-info'
const HIGHTLIGHTED = 'rgba(14, 101, 235, .1)'
const UNHIGHTLIGHTED = 'transparent'

const isInRange = (minVal, maxVal) => (_, index) => {
  return minVal - 1 <= index && index <= maxVal - 1
}
const paint = color => node => {
  node.style.background = color
  return node
}
const isRowInfo = node => node.classList.contains(ROW_INFO)
const isCell = node => node.classList.contains(CELL)
const isInRow = $element => $element.$el && $element.containsClass(ROW)

export class TableSelection {
  constructor($root) {
    this.$root = $root
    this.lastMinCol = null
    this.lastMaxCol = null
    this.lastMinRow = null
    this.lastMaxRow = null
    this.lastSelected = null
    this.selectedCells = []
    this.colNumEnd = 1
    this.rowNumEnd = 1
  }

  init(event) {
    const cell = event.target.closest('.cell')
    if (cell) {
      const $cell = $(cell)
      this.clearSelect()
      this.clearSelectedGroup()
      this.select($cell)

      const $resizable = $cell.closest(RESIZABLE)
      const colNumStart = parseInt($cell.data.col)
      const rowNumStart = parseInt(
          [...$resizable.children].filter(isRowInfo)[0].innerText
      )

      document.onmousemove = e => {
        const $current = $(e.target)
        const colNumEnd = parseInt($current.data.col) || this.colNumEnd
        this.colNumEnd = colNumEnd

        const $resizableEnd = $current.closest(RESIZABLE)
        const rowNumEnd = isInRow($resizableEnd) ?
          parseInt([...$resizableEnd.children].filter(isRowInfo)[0].innerText) :
          this.rowNumEnd
        this.rowNumEnd = rowNumEnd

        const [minCol, maxCol] = getMinAndMax(colNumStart, colNumEnd)
        const [minRow, maxRow] = getMinAndMax(rowNumStart, rowNumEnd)

        if (this.lastMinCol != minCol || this.lastMaxCol != maxCol ||
            this.lastMinRow != minRow || this.lastMaxRow != maxRow) {
          this.clearSelectedGroup()
          this.lastMinCol = minCol
          this.lastMaxCol = maxCol
          this.lastMinRow = minRow
          this.lastMaxRow = maxRow
          this.selectGroup(minCol, maxCol, minRow, maxRow)
        }
      }
      document.onmouseup = e => {
        console.log('stop')
        document.onmousemove = null
      }
    }
  }

  select($cell) {
    $cell.addClass(SELECTED)
    this.lastSelected = $cell
  }

  clearSelect() {
    if (this.lastSelected) {
      this.lastSelected.removeClass(SELECTED)
    }
  }

  selectGroup(minCol, maxCol, minRow, maxRow) {
    this.selectedCells = []
    for (let i = minCol; i <= maxCol; i++) {
      const col = [...this.$root.findAll(`[data-col="${i}"]`)]
          .filter(isCell).filter(isInRange(minRow, maxRow))
      this.selectedCells.push(...col)
    }
    this.selectedCells.map(paint(HIGHTLIGHTED))
  }

  clearSelectedGroup() {
    this.selectedCells.map(paint(UNHIGHTLIGHTED))
    this.selectedCells = []
  }
}
