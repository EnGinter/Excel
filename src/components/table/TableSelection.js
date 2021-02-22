const selectedClass = 'selected'

export class TableSelection {
  super($root) {
    this.root = $root
    this.selected = []
  }

  select($cell) {
    this.selected.push($cell)
    $cell.addClass(selectedClass)
  }

  selectGroup() {

  }
}

