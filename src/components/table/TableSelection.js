import {$} from '@core/dom'
import {Matrix} from './table.matrix.js'
import {isCell} from './table.functions.js'

export class TableSelection {
  constructor($root) {
    this.$root = $root
    this.matrix = new Matrix($root)
    this.matrix.setCursor(this.$root.find('[data-id="0:0"]'))

    window['TableSelect'] = this // for debugging
  }

  mouseDownHandle(event) {
    if (event.shiftKey) {
      this.matrix.fill($(event.target))
    } else {
      this.matrix.setCursor($(event.target))

      document.onmousemove = e => {
        if (isCell(e)) {
          this.matrix.fill($(e.target))
        }

        document.onmouseup = e => {
          document.onmousemove = null
        }
      }
    }
  }

  keyDownHandle(event) {
    event.preventDefault()
    switch (event.key) {
      case 'Enter':
        this.matrix.moveVertical()
        // if (event.shiftKey) {
        // }
        break
      case 'Tab':
        if (event.shiftKey) {
          this.matrix.moveHorizontal(-1)
        } else {
          this.matrix.moveHorizontal()
        }
        break
      case 'ArrowLeft':
        if (event.shiftKey) {
          this.matrix.growShrinkHorizontal(-1)
          break
        }
        this.matrix.empty()
        this.matrix.moveHorizontal(-1)
        break
      case 'ArrowRight':
        if (event.shiftKey) {
          this.matrix.growShrinkHorizontal()
          break
        }
        this.matrix.empty()
        this.matrix.moveHorizontal()
        break
      case 'ArrowUp':
        if (event.shiftKey) {
          this.matrix.growShrinkVertical(-1)
          break
        }
        this.matrix.empty()
        this.matrix.moveVertical(-1)
        break
      case 'ArrowDown':
        if (event.shiftKey) {
          this.matrix.growShrinkVertical()
          break
        }
        this.matrix.empty()
        this.matrix.moveVertical()
        break
    }
  }
}
