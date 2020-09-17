import {$} from '@core/dom'
import {getMinAndMax, TABLE} from '@core/utils'

const SELECTED = 'selected'
const HIGHTLIGHTED = 'group-selected'

export class TableSelection {
  constructor($root) {
    this.$root = $root
    this.selected = null
    this.current = null
    this.selectedCells = []
    this.lastMinCol = null
    this.lastMaxCol = null
    this.lastMinRow = null
    this.lastMaxRow = null

    this.select(this.$root.find('[data-id="0:0"]'))
  }

  mouseDownHandle(event) {
    if (event.shiftKey) {
      this.mouseSecondPlaceHandle(event)
    } else {
      this.select($(event.target))
      this.clearSelectedGroup()

      document.onmousemove = e => {
        this.mouseSecondPlaceHandle(e)

        document.onmouseup = e => {
          document.onmousemove = null
        }
      }
    }
  }

  mouseSecondPlaceHandle(event, fromKey=null) {
    // console.log(event)
    if (event.target.dataset.id) {
      console.log('here')
      const {row: rowStart, col: colStart} = this.selected.id()
      console.log(rowStart, colStart)
      const {row: rowEnd, col: colEnd} = $(event.target).id()
      console.log(rowEnd, colEnd)
      const [minCol, maxCol] = getMinAndMax(colStart, colEnd)
      const [minRow, maxRow] = getMinAndMax(rowStart, rowEnd)
      console.log(minCol, maxCol, minRow, maxRow)
      if (this.lastMinCol != minCol || this.lastMaxCol != maxCol ||
          this.lastMinRow != minRow || this.lastMaxRow != maxRow) {
        this.lastMinCol = minCol
        this.lastMaxCol = maxCol
        this.lastMinRow = minRow
        this.lastMaxRow = maxRow
        this.selectGroup(minCol, maxCol, minRow, maxRow)
      }
    }
  }

  select($cell) {
    this.clearSelect()
    this.selected = $cell
    $cell.addClass(SELECTED).focus()
  }

  reselect(deltaRow, deltaCol) {
    let {row, col} = this.selected.id()
    const currRow = row + deltaRow
    const currCol = col + deltaCol
    row = currRow >= TABLE.minHeight && currRow <= TABLE.maxHeight - 1 ?
          currRow :
          row
    col = currCol >= TABLE.minWidth && currCol <= TABLE.maxWidth - 1 ?
          currCol :
          col
    this.select(this.$root.find(`[data-id="${row}:${col}"]`))
  }

  findNext(deltaRow, deltaCol) {
    let {row, col} = this.selected.id()
    const currRow = row + deltaRow
    const currCol = col + deltaCol
    row = currRow >= TABLE.minHeight && currRow <= TABLE.maxHeight - 1 ?
          currRow :
          row
    col = currCol >= TABLE.minWidth && currCol <= TABLE.maxWidth - 1 ?
          currCol :
          col
    return [row, col]
  }

  clearSelect() {
    if (this.selected) {
      this.selected.removeClass(SELECTED)
    }
    this.selected = null
  }

  selectGroup(minCol, maxCol, minRow, maxRow) {
    this.clearSelectedGroup()
    for (let col = minCol; col <= maxCol; col++) {
      for (let row = minRow; row <= maxRow; row++) {
        const $el = this.$root.find(`[data-id="${row}:${col}"]`)
        $el.addClass(HIGHTLIGHTED)
        this.selectedCells.push($el)
      }
    }
  }

  clearSelectedGroup() {
    if (this.selectedCells) {
      this.selectedCells.map($el => $el.removeClass(HIGHTLIGHTED))
    }
    this.selectedCells = []
  }
  keyDownHandle(event) {
    // TODO перемещение select-ом по выделенным полям с помощью Enter и Tab
    // TODO arrow keys + shift = selector стоит на месте, а меняется secondPlace
    event.preventDefault()
    switch (event.key) {
      case 'Enter':
        if (!this.selectedCells.length) {
          this.reselect(1, 0)
        }
        this.reselect(1, 0)
        break
      case 'Tab':
        if (!this.selectedCells.length) {
          if (event.shiftKey) {
            this.reselect(0, -1)
            break
          }
          this.reselect(0, 1)
        }
        // this.reselect(0, 1)
        break
      case 'ArrowLeft':
        if (event.shiftKey) {
          console.log('left + shift')
          // const val = this.movePointer(0, -1)
          // console.log(val)
          event.target['dataset']['id'] = `${10}:${10}`
          // console.log(event)
          this.mouseSecondPlaceHandle(event)
          break
        }
        this.reselect(0, -1)
        this.clearSelectedGroup()
        break
      case 'ArrowRight':
        this.reselect(0, 1)
        this.clearSelectedGroup()
        break
      case 'ArrowUp':
        this.reselect(-1, 0)
        this.clearSelectedGroup()
        break
      case 'ArrowDown':
        this.reselect(1, 0)
        this.clearSelectedGroup()
        break
    }
  }
}
