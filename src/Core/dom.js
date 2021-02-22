class Dom {
  constructor(selector) {
    this.$selector = typeof selector === 'string'
        ? document.querySelector(selector)
        : selector
  }

  html(html) {
    if (typeof html === 'string') {
      this.$selector.innerHTML = html
      return this
    }
    return this.$selector.outerHTML.trim()
  }

  clear() {
    this.html('')
    return this
  }

  on(eventType, callback) {
    this.$selector.addEventListener(eventType, callback)
  }

  off(eventType, callback) {
    this.$selector.removeEventListener(eventType, callback)
  }

  css(styles = {}) {
    Object
        .keys(styles)
        .map(key => {
          this.$selector.style[key] = styles[key]
        })
  }

  get data() {
    return this.$selector.dataset
  }

  append(node) {
    if (node instanceof Dom) {
      node = node.$selector
    }
    if (Element.prototype.append) {
      this.$selector.append(node)
    } else {
      this.$selector.appendChild(node)
    }

    return this
  }

  getCords() {
    return this.$selector.getBoundingClientRect()
  }

  getClosest(name) {
    return this.$selector.closest(name)
  }

  setAttribute(attr, value) {
    return this.$selector.setAttribute(attr, value)
  }

  findAll(selector) {
    return this.$selector.querySelectorAll(selector)
  }

  find(selector) {
    return $(this.$selector.querySelector(selector))
  }

  addClass(className) {
    this.$selector.classList.add(className)
  }

  removeClass(className) {
    this.$selector.classList.remove(className)
  }
}

export function $(selector) {
  return new Dom(selector)
}

$.create = (tagName, classNames) => {
  const el = document.createElement(tagName)
  if (classNames) {
    el.classList.add(classNames)
  }

  return $(el)
}
