import {ExcelComponent} from '@core/ExcelComponent'
import {createTable} from './table.template.js'
import {resizeHandler} from './table.resize.js'
import {$} from '@core/dom'

export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root) {
    super($root, {
      listeners: ['mousedown'],
    })
    this.document = {}
    this.getElements = this.getElements.bind(this)
    this.toDebounce = false
    // Vertical and horizontal resize pointers
    this.horizontal = $.create('div', 'horizontal-pointer')
    this.vertical = $.create('div', 'vertical-pointer')
  }

  toHTML() {
    return createTable(50)
  }

  getElements(selector) {
    let element = this.document[selector]
    if (!element) {
      element = document.querySelectorAll(selector)
      this.document[selector] = element
    }

    return element
  }

  onMousedown(event) {
    resizeHandler(this, event)
  }
}
