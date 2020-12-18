import {ExcelComponent} from '@core/ExcelComponent'
import {changeTitle} from '@/store/actions'
import {$} from '@core/dom'

export class Header extends ExcelComponent {
  static className = 'excel__header'

  constructor($root, options) {
    super($root, {
      name: 'Header',
      listeners: ['input', 'keydown'],
      ...options,
    })
    this.input = null
  }

  toHTML() {
    return `
      <input type="text" class="input" value="Новая таблица" />
      <div>
          <div class="button">
              <i class="material-icons">delete</i>
          </div>
          <div class="button">
              <i class="material-icons">exit_to_app</i>
          </div>
      </div>
    `
  }

  init() {
    super.init()
    this.$input = this.$root.find('.input')
    const {title} = this.store.getState()
    this.$input.text(title)
    this.$on('header:input', text => {
      this.$dispatch(changeTitle(text))
    })
  }

  onInput(event) {
    const text = $(event.target).text()
    this.$emit('header:input', text)
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      this.$emit('formula:enter')
    }
  }
}
