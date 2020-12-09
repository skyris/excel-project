import {ExcelComponent} from '@core/ExcelComponent'
import {$} from '@core/dom'

export class Formula extends ExcelComponent {
  static className = 'excel__formula'

  constructor($root, options) {
    super($root, {
      name: 'Formula',
      listeners: ['input', 'click', 'keydown'],
      ...options,
    })
  }

  init() {
    super.init()
    this.$formula = this.$root.find('[data-type="formula"]')
    this.$on('table:input', text => {
      this.$formula.text(text)
    })
    this.$on('table:selected', text => {
      this.$formula.text(text)
    })
  }

  toHTML() {
    return `
      <div class="info">fx</div>
      <div 
        class="input"
        contenteditable
        spellcheck="false"
        data-type="formula"
      >
      </div>
    `
  }
  onInput(event) {
    const text = $(event.target).text()
    this.$emit('formula:input', text)
  }
  onClick() {}

  onKeydown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      this.$emit('formula:enter')
    }
  }
}
