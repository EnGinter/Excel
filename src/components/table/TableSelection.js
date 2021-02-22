const selectedClass = 'selected'

export class TableSelection {
  constructor() {
    this.selected = []
  }

  select($el) {
    this.selected.push($el)
    $el.addClass(selectedClass)
  }

  selectGroup() {

  }
}

