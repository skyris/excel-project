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
      listeners: ['mousedown', 'click', 'keydown'],
    })
    this.document = {}
    this.toDebounce = false
    // Vertical and horizontal resize pointers
    this.horizontal = $.create('div', 'horizontal-pointer')
    this.vertical = $.create('div', 'vertical-pointer')
  }

  toHTML() {
    return createTable()
  }

  prepare() {
    // this.selection = new TableSelection(this.$root)
  }

  init() {
    super.init()
    this.selection = new TableSelection(this.$root)
    // const $cells = this.$root.find('[data-id="1:1"]')
    // this.selection.select($cells)
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      resizeHandler(this, event)
    } else if (isCell(event)) {
      this.selection.mouseDownHandle(event)
    }
  }

  onKeydown(event) {
    const keys = [
      'Tab',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
    ]
    const shiftEnter = event.key === 'Enter' && event.shiftKey
    if (keys.includes(event.key) && !shiftEnter) {
      this.selection.keyDownHandle(event)
    }
  }

  onClick(event) {
    // this.tableSelection.select(event)
  }
}
