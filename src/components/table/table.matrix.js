import {range, TABLE} from '@core/utils'
import {isDomInstance} from './table.functions'

const FIRST_PLACE = 'FIRST_PLACE'
const LAST_PLACE = 'LAST_PLACE'
const OTHER_PLACE = 'OTHER_PLACE'

export class Matrix {
  static cursorClass = 'selected'
  static groupClass = 'group-selected'
  static headerClass = 'header-selected'

  constructor(table) {
    this._data = []
    this.$root = table.$root
    this.$addRowsInput = table.$addRowsInput
    this.$cursor = null
    this.cursorPlace = null
    this.border = {
      rowStart: null,
      rowEnd: null,
      colStart: null,
      colEnd: null,
    }
    this.vertToReal = []
  }

  setCursor($cursor) {
    if (this.$cursor) {
      this.empty()
      this.$cursor.removeClass(Matrix.cursorClass)
      const {row, col} = this.$cursor.id()
      this.$root.find(`[data-col="${col}"]`).removeClass(Matrix.headerClass)
      this.$root.find(`[data-row="${row}"]`).removeClass(Matrix.headerClass)
    }
    this.$cursor = $cursor.addClass(Matrix.cursorClass).focus()
    const {row, col} = this.$cursor.id()
    this.$root.find(`[data-col="${col}"]`).addClass(Matrix.headerClass)
    this.$root.find(`[data-row="${row}"]`).addClass(Matrix.headerClass)
  }

  fill(point, point2=null) {
    if (isDomInstance(point)) {
      point = point.id()
    }
    if (isDomInstance(point2)) {
      point2 = point2.id()
    } else if (point2 === null) {
      point2 = this.$cursor.id()
    }
    this.empty()
    let {row: rowStart, col: colStart} = point
    let {row: rowEnd, col: colEnd} = point2
    if (rowStart > rowEnd) {
      [rowStart, rowEnd] = [rowEnd, rowStart]
    }
    if (colStart > colEnd) {
      [colStart, colEnd] = [colEnd, colStart]
    }
    this.border = {rowStart, rowEnd, colStart, colEnd}
    for (const row of range(rowStart, rowEnd)) {
      for (const col of range(colStart, colEnd)) {
        this._data.push(this.$root.find(`[data-id="${row}:${col}"]`))
      }
    }
    this.addGroupClass()
    this.addHeaderClass()
    this.createVerticalToReal()
    this.cursorPlace = this._data.findIndex($el => {
      return $el.data.id === this.$cursor.data.id
    })
  }

  get isEmpty() {
    return this._data.length == 0
  }

  empty() {
    if (this._data.length > 0) {
      this.removeGroupClass()
      this.removeHeaderClass()
      this._data = []
      this.cursorPlace = null
    }
  }

  applyStyle(style) {
    if (!this.isEmpty) {
      this._data.forEach($el => $el.css(style))
    } else {
      this.$cursor.css(style)
    }
  }

  getCursorPlaceInMatrix() {
    if (this.isEmpty) return
    const {colStart, colEnd, rowStart, rowEnd} = this.border
    const colsNumber = Math.abs(colEnd - colStart) + 1
    const rowsNumber = Math.abs(rowEnd - rowStart) + 1
    const cursorColumnPlace = this.cursorPlace % colsNumber
    let column
    if (cursorColumnPlace === 0 ) {
      column = FIRST_PLACE
    } else if (cursorColumnPlace === colsNumber - 1) {
      column = LAST_PLACE
    } else {
      column = OTHER_PLACE
    }
    const cursorRowPlace = Math.floor(this.cursorPlace / colsNumber)
    let row
    if (cursorRowPlace === 0 ) {
      row = FIRST_PLACE
    } else if (cursorRowPlace === rowsNumber - 1) {
      row = LAST_PLACE
    } else {
      row = OTHER_PLACE
    }
    // first, last, other
    return {row, column}
  }

  growShrinkHorizontal(sign=1) {
    if (sign === 1) {
      if (this.isEmpty) {
        // isEmpty -> grow right
        const {row, col} = this.$cursor.id()
        if (col === TABLE.maxWidth - 1) return
        this.fill({row, col: col + 1})
        return
      }
      const {column} = this.getCursorPlaceInMatrix()
      const {rowStart, rowEnd, colStart, colEnd} = this.border
      if (column === FIRST_PLACE) {
        // first col -> grow right
        if (colEnd === TABLE.maxWidth - 1) return
        const point = {row: rowStart, col: colStart}
        const point2 = {row: rowEnd, col: colEnd + 1}
        this.fill(point, point2)
      } else {
        // else -> shrink right
        const point = {row: rowStart, col: colStart + 1}
        const point2 = {row: rowEnd, col: colEnd}
        this.fill(point, point2)
      }
    } else {
      if (this.isEmpty) {
        // isEmpty -> grow left
        const {row, col} = this.$cursor.id()
        if (col === TABLE.minWidth) return
        this.fill({row, col: col - 1})
        return
      }
      const {column} = this.getCursorPlaceInMatrix()
      const {rowStart, rowEnd, colStart, colEnd} = this.border
      if (column === LAST_PLACE) {
        // first col -> grow left
        if (colStart === TABLE.minWidth) return
        const point = {row: rowStart, col: colStart - 1}
        const point2 = {row: rowEnd, col: colEnd}
        this.fill(point, point2)
      } else {
        // else -> shrink left
        if (colStart === TABLE.minWidth) return
        const point = {row: rowStart, col: colStart}
        const point2 = {row: rowEnd, col: colEnd - 1}
        this.fill(point, point2)
      }
    }
  }

  growShrinkVertical(sign=1) {
    if (sign === 1) {
      if (this.isEmpty) {
        // isEmpty -> grow up
        const {row, col} = this.$cursor.id()
        if (row === TABLE.maxHeight - 1) return
        this.fill({row: row+1, col})
        return
      }
      const {row} = this.getCursorPlaceInMatrix()
      const {rowStart, rowEnd, colStart, colEnd} = this.border
      if (row === FIRST_PLACE) {
        // first row -> grow down
        if (rowEnd === TABLE.maxHeight - 1) return
        const point = {row: rowStart, col: colStart}
        const point2 = {row: rowEnd + 1, col: colEnd}
        this.fill(point, point2)
      } else {
        // else -> shrink down
        const point = {row: rowStart + 1, col: colStart}
        const point2 = {row: rowEnd, col: colEnd}
        this.fill(point, point2)
      }
    } else {
      if (this.isEmpty) {
        // isEmpty -> grow up
        const {row, col} = this.$cursor.id()
        if (row === TABLE.minHeight) return
        this.fill({row: row - 1, col})
        return
      }
      const {row} = this.getCursorPlaceInMatrix()
      const {rowStart, rowEnd, colStart, colEnd} = this.border
      if (row === LAST_PLACE) {
        // last row -> grow up
        if (rowStart === TABLE.minHeight) return
        const point = {row: rowStart - 1, col: colStart}
        const point2 = {row: rowEnd, col: colEnd}
        this.fill(point, point2)
      } else {
        // else -> shrink up
        const point = {row: rowStart, col: colStart}
        const point2 = {row: rowEnd - 1, col: colEnd}
        this.fill(point, point2)
      }
    }
  }

  addGroupClass() {
    this._data.forEach($el => $el.addClass(Matrix.groupClass))
  }

  removeGroupClass() {
    this._data.forEach($el => $el.removeClass(Matrix.groupClass))
  }

  addHeaderClass() {
    const {rowStart, rowEnd, colStart, colEnd} = this.border
    for (const num of range(rowStart, rowEnd)) {
      this.$root.find(`[data-row="${num}"]`).addClass(Matrix.headerClass)
    }
    for (const num of range(colStart, colEnd)) {
      this.$root.find(`[data-col="${num}"]`).addClass(Matrix.headerClass)
    }
  }

  removeHeaderClass() {
    const {row, col} = this.$cursor.id()
    const {rowStart, rowEnd, colStart, colEnd} = this.border
    for (const num of range(rowStart, rowEnd).filter(el => el !== row)) {
      this.$root.find(`[data-row="${num}"]`).removeClass(Matrix.headerClass)
    }
    for (const num of range(colStart, colEnd).filter(el => el !== col)) {
      this.$root.find(`[data-col="${num}"]`).removeClass(Matrix.headerClass)
    }
  }

  getRealPlace(num) {
    const mod = this._data.length
    return (num % mod + mod) % mod
  }

  createVerticalToReal() {
    const {rowStart, rowEnd, colStart, colEnd} = this.border
    const colsNumber = Math.abs(colEnd - colStart) + 1
    const rowsNumber = Math.abs(rowEnd - rowStart) + 1
    this.vertToReal = []
    for (const col of range(0, colsNumber - 1)) {
      for (const row of range(0, rowsNumber - 1)) {
        this.vertToReal.push(colsNumber * row + col)
      }
    }
  }

  moveHorizontal(sign=1) {
    if (this.isEmpty) {
      const {row, col} = this.$cursor.id()
      if (sign === 1) {
        if (col === TABLE.maxWidth - 1) return;
        this.$cursor.removeClass(Matrix.cursorClass)
        this.$cursor = this.$root.find(`[data-id="${row}:${col+1}"]`)
        this.$cursor.addClass(Matrix.cursorClass).focus()
        this.$root.find(`[data-col="${col}"]`).removeClass(Matrix.headerClass)
        this.$root.find(`[data-col="${col+1}"]`).addClass(Matrix.headerClass)
      } else {
        if (col === TABLE.minWidth) return;
        this.$cursor.removeClass(Matrix.cursorClass)
        this.$cursor = this.$root.find(`[data-id="${row}:${col-1}"]`)
        this.$cursor.addClass(Matrix.cursorClass).focus()
        this.$root.find(`[data-col="${col}"]`).removeClass(Matrix.headerClass)
        this.$root.find(`[data-col="${col-1}"]`).addClass(Matrix.headerClass)
      }
    } else {
      this._data[this.cursorPlace].removeClass(Matrix.cursorClass)
      if (sign === 1) {
        this.cursorPlace = this.getRealPlace(this.cursorPlace + 1)
      } else {
        this.cursorPlace = this.getRealPlace(this.cursorPlace - 1)
      }
      this.$cursor = this._data[this.cursorPlace]
      this.$cursor.addClass(Matrix.cursorClass).focus()
    }
  }

  moveVertical(sign=1) {
    if (this.isEmpty) {
      const {row, col} = this.$cursor.id()
      if (sign === 1) {
        if (row === TABLE.maxHeight - 1) {
          this.$addRowsInput.$el.scrollIntoView()
          return;
        }
        this.$cursor.removeClass(Matrix.cursorClass)
        this.$cursor = this.$root.find(`[data-id="${row+1}:${col}"]`)
        this.$cursor.addClass(Matrix.cursorClass).focus()
        this.$root.find(`[data-row="${row}"]`).removeClass(Matrix.headerClass)
        this.$root.find(`[data-row="${row+1}"]`).addClass(Matrix.headerClass)
      } else {
        if (row === TABLE.minHeight) return;
        this.$cursor.removeClass(Matrix.cursorClass)
        this.$cursor = this.$root.find(`[data-id="${row-1}:${col}"]`)
        this.$cursor.addClass(Matrix.cursorClass).focus()
        this.$root.find(`[data-row="${row}"]`).removeClass(Matrix.headerClass)
        this.$root.find(`[data-row="${row-1}"]`).addClass(Matrix.headerClass)
      }
    } else {
      const vertIndex = this.vertToReal.findIndex(el => el === this.cursorPlace)
      this._data[this.cursorPlace].removeClass(Matrix.cursorClass)
      if (sign === 1) {
        this.cursorPlace = this.vertToReal[this.getRealPlace(vertIndex + 1)]
      } else {
        this.cursorPlace = this.vertToReal[this.getRealPlace(vertIndex - 1)]
      }
      this.$cursor = this._data[this.cursorPlace]
      this.$cursor.addClass(Matrix.cursorClass).focus()
    }
  }
}
