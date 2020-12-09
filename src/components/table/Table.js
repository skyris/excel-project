import {ExcelComponent} from '@core/ExcelComponent'
import {createTable, addMoreRowsToTable} from './table.template.js'
import {resizeHandler} from './table.resize.js'
import {TableSelection} from './TableSelection.js'
import {shouldResize, isCell, isAddRowsButton} from './table.functions.js'
import {$} from '@core/dom'


export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root, options) {
    super($root, {
      listeners: ['mousedown', 'click', 'keydown', 'input'],
      name: 'Table',
      ...options,
    })
    // Vertical and horizontal resize pointers
    this.horizontal = $.create('div', 'horizontal-pointer')
    this.vertical = $.create('div', 'vertical-pointer')
  }

  toHTML() {
    return createTable()
  }

  prepare() {
  }

  get $cursor() {
    return this.selection.matrix.$cursor
  }

  init() {
    super.init()
    this.selection = new TableSelection(this.$root)
    this.$emit('table:selected', this.$cursor.text())
    this.$on('formula:input', text => {
      this.$cursor.text(text)
    })

    this.$on('formula:enter', () => {
      this.$cursor.focus()
      // moveCursorToEnd($el)
      // function moveCursorToEnd(el) {
      //   if (typeof el.selectionStart == "number") {
      //     el.selectionStart = el.selectionEnd = el.value.length;
      //   } else if (typeof el.createTextRange != "undefined") {
      //     el.focus();
      //     var range = el.createTextRange();
      //     range.collapse(false);
      //     range.select();
      //   }
      // }
    })
  }

  onInput(event) {
    this.$emit('table:input', $(event.target).text())
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      resizeHandler(this, event)
    } else if (isCell(event)) {
      this.selection.mouseDownHandle(event)
      this.$emit('table:selected', this.$cursor.text())
    } else if (isAddRowsButton(event)) {
      addMoreRowsToTable()
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
      this.$emit('table:selected', this.$cursor.text())
    }
  }

  onClick(event) {
    // this.tableSelection.select(event)
  }
}
