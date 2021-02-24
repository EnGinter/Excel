export class TableSelection {
  static selectedClassName = 'selected'

  constructor(root) {
    this.$root = root
    this.selected = []
  }

  select($el) {
    this.clear()

    this.selected.push($el)
    $el.addClass(TableSelection.selectedClassName)
  }

  clear() {
    this.selected.forEach($el => $el.removeClass(TableSelection.selectedClassName))
    this.selected = []
  }

  selectGroup() {

  }
}

