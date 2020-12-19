class Dom {
  constructor(selector) {
    this.$el = typeof selector === 'string'?
      document.querySelector(selector):
      selector
  }

  html(html) {
    if (typeof html === 'string') {
      this.$el.innerHTML = html
      return this
    }
    return this.$el.outerHTML.trim()
  }

  text(text) {
    if (typeof text === 'string') {
      if (this.$el.tagName.toLowerCase() === 'input') {
        this.$el.value = text
      } else {
        this.$el.textContent = text
      }
      return this
    }
    if (this.$el.tagName.toLowerCase() === 'input') {
      return this.$el.value.trim()
    }
    return this.$el.textContent.trim()
  }

  insertHTML(html) {
    this.$el.insertAdjacentHTML('beforeend', html)
  }

  clear() {
    this.html('')
    return this
  }

  on(eventType, callback) {
    this.$el.addEventListener(eventType, callback)
  }

  off(eventType, callback) {
    this.$el.removeEventListener(eventType, callback)
  }

  append(node) {
    if (node instanceof Dom) {
      node = node.$el
    }
    if (Element.prototype.append) {
      this.$el.append(node)
    } else {
      this.$el.appendChild(node)
    }
    return this
  }

  remove() {
    this.$el.remove()
  }


  get data() {
    return this.$el.dataset
  }

  closest(selector) {
    return $(this.$el.closest(selector))
  }
  addClass(className) {
    this.$el.classList.add(className)
    return this
  }

  removeClass(className) {
    this.$el.classList.remove(className)
    return this
  }

  toggleClass(className) {
    this.$el.classList.toggle(className)
    return this
  }
  containsClass(className) {
    return this.$el.classList.contains(className)
  }

  get numValue() {
    const found = this.$el.value.match(/([0-9]*)/g);
    const value = found.filter(el => el.length != 0)
        .map(el => parseInt(el, 10))[0] || 0
    this.$el.value = value
    return value
  }

  get children() {
    return this.$el.children
  }

  getCoords() {
    return this.$el.getBoundingClientRect()
  }

  findAll(selector) {
    // return this.$el.querySelectorAll(selector)
    return [...this.$el.querySelectorAll(selector)].map(el => $(el))
  }

  find(selector) {
    return $(this.$el.querySelector(selector))
  }

  css(styles={}) {
    Object.entries(styles).forEach(([key, value]) => {
      // in some cases works this:
      this.$el.style[key] = value
      // in other cases works that:
      this.$el.style.setProperty(key, value)
    })
    return this
  }

  getStyles(styles=[]) {
    return styles.reduce((result, style) => {
      result[style] = this.$el.style[style]
      return result
    }, {})
  }

  id(colon) {
    if (colon === ':') {
      return this.data.id
    }
    const [row, col] = this.data.id.split(':').map(d => parseInt(d, 10))
    return {row, col}
  }

  focus() {
    this.$el.focus()
    return this
  }

  blur() {
    this.$el.blur()
    return this
  }
}

export function $(selector) {
  return new Dom(selector)
}

$.create = (tagName, classes='') => {
  const el = document.createElement(tagName)
  if (classes) {
    el.classList.add(classes)
  }
  return $(el)
}
