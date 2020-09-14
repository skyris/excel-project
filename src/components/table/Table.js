import {ExcelComponent} from '@core/ExcelComponent'
import {createTable} from './table.template.js'
import {resizeHandler} from './table.resize.js'
import {TableSelection} from './TableSelection.js'
import {$} from '@core/dom'


export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root) {
    super($root, {
      listeners: ['mousedown', 'click'],
    })
    this.document = {}
    this.toDebounce = false
    // Vertical and horizontal resize pointers
    this.horizontal = $.create('div', 'horizontal-pointer')
    this.vertical = $.create('div', 'vertical-pointer')
  }

  toHTML() {
    return createTable(50)
  }

  init() {
    super.init()
    this.select = new TableSelection(this.$root)
  }

  onMousedown(event) {
    resizeHandler(this, event)
    this.select.init(event)
  }

  onClick(event) {
    // this.tableSelection.select(event)
  }
}
