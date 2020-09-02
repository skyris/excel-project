import {ExcelComponent} from '@core/ExcelComponent'
import {createTable} from './table.template.js'

export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root) {
    super($root, {
      listeners: ['mousedown'],
    })
  }

  toHTML() {
    return createTable(50)
  }
}
