import {ExcelComponent} from '@core/ExcelComponent'
import {createTable, addMoreRowsToTable} from './table.template.js'
import {resizeHandler} from './table.resize.js'
import {TableSelection} from './TableSelection.js'
import {shouldResize, isCell, isAddRowsButton} from './table.functions.js'
import {tableResize, changeText, addRows} from '@/store/actions'
import {$} from '@core/dom'


export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root, options) {
    super($root, {
      listeners: ['mousedown', 'click', 'keydown', 'input', 'paste'],
      name: 'Table',
      ...options,
    })
    // Vertical and horizontal resize pointers
    this.horizontal = $.create('div', 'horizontal-pointer')
    this.vertical = $.create('div', 'vertical-pointer')
    this.$inner = null
    this.$rowsHeader = null
    this.$addRowsInput = null
  }

  toHTML() {
    return createTable(this.store.getState())
  }

  prepare() {
  }

  get $cursor() {
    return this.selection.matrix.$cursor
  }

  init() {
    super.init()

    this.$inner = this.$root.find('.inner')
    this.$rowsHeader = this.$root.find('.rows-header')
    this.$addRowsInput = this.$root.find('[data-type="add-rows-input"]')

    this.selection = new TableSelection(this)
    this.$emit('table:selected', this.$cursor.text())
    this.$on('formula:input', text => {
      this.$cursor.text(text)
      this.$dispatch(changeText({
        text: this.$cursor.text(),
        id: this.$cursor.id(':'),
      }))
    })

    this.$on('formula:enter', () => {
      this.$cursor.focus()
    })
  }

  onInput(event) {
    const $target = $(event.target)
    this.$dispatch(changeText({
      text: $target.text(),
      id: $target.id(':'),
    }))
  }

  async resizeTable(event) {
    try {
      const data = await resizeHandler(this, event)
      this.$dispatch(tableResize(data))
    } catch (e) {
      console.warn('Resize error: ', e.message)
    }
  }

  async onMousedown(event) {
    if (shouldResize(event)) {
      this.resizeTable(event)
    } else if (isCell(event)) {
      this.selection.mouseDownHandle(event)
      this.$emit('table:selected', this.$cursor.text())
    } else if (isAddRowsButton(event)) {
      const data = await addMoreRowsToTable(this)
      this.$dispatch(addRows(data))
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

  onPaste(event) {
    this.onInput(event)
  }
}
