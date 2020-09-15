import {ExcelComponent} from '@core/ExcelComponent'
import {createTable} from './table.template.js'
import {resizeHandler} from './table.resize.js'
import {TableSelection} from './TableSelection.js'
import {shouldResize, isCell} from './table.functions.js'
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

  prepare() {
    this.selection = new TableSelection(this.$root)
  }

  init() {
    super.init()
    const $cells = this.$root.find('[data-id="1:1"]')
    this.selection.select($cells)
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      resizeHandler(this, event)
    } else if (isCell(event)) {
      console.log(event)
      console.log(event.shiftKey)
      this.selection.init(event.target)
    }
  }

  onClick(event) {
    // this.tableSelection.select(event)
  }
}
