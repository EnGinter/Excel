export class TableSelection {
  static selectedClassName = 'selected'

  constructor() {
    this.selected = []
    this.currentCell = null
  }

  select($el) {
    this.clear()

    this.selected.push($el)
    this.currentCell = $el
    $el.addClass(TableSelection.selectedClassName)
  }

  clear() {
    this.selected.forEach($el => $el.removeClass(TableSelection.selectedClassName))
    this.selected = []
  }

  selectGroup($selected = []) {
    this.clear()
    this.selected = $selected

    this.selected.forEach($el => $el.addClass(TableSelection.selectedClassName))
  }

  selectByKey(row, col) {
    const next = this.$root.find(`[data-id="${col}:${row}"]`)
    this.select(next)
    next.focus()
  }
}

