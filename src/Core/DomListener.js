import { capitalize } from '@core/utils';

export class DomListener {
  constructor( $root, listeners = [] ) {
    if (!$root) {
      throw new Error('No $root provided to DomListener')
    }
    this.$root = $root
    this.listeners = listeners
  }

  removeDomListeners() {
    this.listeners.forEach(listener => {
      const method = getMethodName(listener)

      this.$root.off(listener, this[method])
    })
  }

  initDomListeners() {
    this.listeners.forEach(listener => {
      const method = getMethodName(listener)
      if (!this[method]) {
        throw new Error(
            `There is no ${method} method on ${this.name} Component`
        )
      }
      this[method] = this[method].bind(this)

      this.$root.on(listener, this[method])
    })
  }
}

function getMethodName(eventMame) {
  return 'on' + capitalize(eventMame)
}
