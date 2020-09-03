import {ExcelComponent} from '@core/ExcelComponent'
import {createTable} from './table.template.js'
import {CODES} from '@core/utils'

export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root) {
    super($root, {
      listeners: ['mousedown', 'mousemove', 'mouseup'],
    })
    this.resize = null
    this.target = null
    this.width = null
    this.height = null
    this.startX = null
    this.startY = null
  }

  toHTML() {
    return createTable(50)
  }

  onMousedown(event) {
    if (event.target.dataset.resize) {
      this.resize = event.target.dataset.resize
      this.target = event.target.parentElement
      this.width = this.target.offsetWidth
      this.height = this.target.offsetHeight
      this.startX = event.clientX
      this.startY = event.clientY
      this.rowData = Array.prototype.slice.call(
          document.querySelectorAll('.row-data'), 1)
    }
  }

  onMousemove(event) {
    if (this.resize === 'col') {
      const width = `${this.width - this.startX + event.clientX}px`
      this.target.style.width = width
      const symbol = this.target.innerText
      const colNum = symbol.charCodeAt(0) - CODES.A
      this.rowData.forEach(row => row.children[colNum].style.width = width)
    } else if (this.resize === 'row') {
      this.target.parentElement.style.height =
        `${this.height - this.startY + event.clientY}px`
    }
  }

  onMouseup(event) {
    this.resize = null
    this.target = null
    this.width = null
    this.height = null
    this.startX = null
    this.startY = null
  }
}
