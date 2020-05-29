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
