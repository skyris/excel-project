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
      this.$el.style.setProperty(key, value)
    })
    return this
  }

  id(parse) {
    if (parse) {
      // const id = this.id()
      return this.find('[data-id="0:0"]')
    }
    const [row, col] = this.data.id.split(':').map(d => parseInt(d, 10))
    return {row, col}
  }

  focus() {
    this.$el.focus()
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
