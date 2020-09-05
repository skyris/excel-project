import {ExcelComponent} from '@core/ExcelComponent'
import {createTable} from './table.template.js'
// import {CODES} from '@core/utils'
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
    if (event.target.dataset.resize) {
      const $target = $(event.target)
      const $parent = $target.closest('[data-type="resizable"]')
      const coords = $parent.getCoords()
      const pointer = document.querySelector('.excel__table')
      pointer.style.setProperty('--mouse-x', event.clientX + 'px')
      pointer.style.setProperty('--opacity-x', '1')
      document.onmousemove = e => {
        if (this.toDebounce) return
        pointer.style.setProperty('--mouse-x', e.clientX + 'px')
        this.toDebounce = true
        setTimeout(() => this.toDebounce = false, 50)

        // element.style.left = e.pageX + 'px'
        // console.log('toDebounce: ', this.toDebounce)
        // if (this.toDebounce) return

        // const delta = e.pageX - coords.right
        // const value = coords.width + delta
        // this.getElements(`[data-col="${$parent.data.col}"]`)
        //     .forEach(el => el.style.width = value + 'px')

        // console.log(this.document)
        // this.toDebounce = true
        // setTimeout(() => this.toDebounce = false, 50)
      }
      document.onmouseup = e => {
        pointer.style.setProperty('--opacity-x', '0')
        const delta = e.pageX - coords.right
        const value = coords.width + delta
        this.getElements(`[data-col="${$parent.data.col}"]`)
            .forEach(el => el.style.width = value + 'px')
        document.onmousemove = null
      }
    }
  }
}
