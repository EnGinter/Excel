import { ExcelComponent } from '@core/ExcelComponent';
import { createTable } from '@/components/table/table.template';
import { tableResize } from '@/components/table/table.resize';
import { TableSelection } from '@/components/table/TableSelection';
import { $ } from '@core/dom';
import { isCellLeftClick, matrix, shouldResize } from '@/components/table/table.functions';

export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root) {
    super($root, {
      name: 'table',
      listeners: ['mousedown', 'keydown']
    });
  }

  toHTML() {
    const {html, rowsCount, colsCount} = createTable()
    this.colsCount = colsCount
    this.rowsCount = rowsCount

    return html
  }

  prepare() {
    this.selection = new TableSelection()
  }

  init() {
    super.init()

    const $cell = this.$root.find(`[data-id="0:0"]`)
    this.selection.select($cell)
  }

  onMousedown(event) {
    if (shouldResize(event)) {
      tableResize(event, this.$root)
    } else if (isCellLeftClick(event)) {
      const $target = $(event.target)

      if (event.shiftKey) {
        const target = $target.id(true)
        const current = this.selection.currentCell.id(true)

        const $selectedCells = matrix(target, current)
            .map(id => this.$root.find(`[data-id="${id}"]`))

        this.selection.selectGroup($selectedCells)
      } else {
        this.selection.select($target)
      }
    }
  }

  onKeydown(event) {
    if (event.key === 'ArrowRight') {
      const current = this.selection.currentCell.id(true)

      if (current.col + 1 < this.colsCount) {
        const next = this.$root.find(`[data-id="${current.row}:${current.col + 1}"]`)
        this.selection.select(next)
        next.focus()
      }
    } else if (event.key === 'ArrowLeft') {
      const current = this.selection.currentCell.id(true)

      if (current.col !== 0) {
        const next = this.$root.find(`[data-id="${current.row}:${current.col - 1}"]`)
        this.selection.select(next)
        next.focus()
      }
    } else if (event.key === 'ArrowUp') {
      const current = this.selection.currentCell.id(true)

      if (current.row !== 0) {
        const next = this.$root.find(`[data-id="${current.row - 1}:${current.col}"]`)
        this.selection.select(next)
        next.focus()
      }
    } else if (event.key === 'ArrowDown') {
      const current = this.selection.currentCell.id(true)

      if (current.row + 1 < this.rowsCount) {
        const next = this.$root.find(`[data-id="${current.row + 1}:${current.col}"]`)
        this.selection.select(next)
        next.focus()
      }
    } else if (event.key === 'Tab') {
      event.preventDefault()
      const current = this.selection.currentCell.id(true)
      current.blur()

      if (current.col + 1 === this.colsCount && current.row + 1 === this.rowsCount) {
      } else if (current.col + 1 === this.colsCount) {
        const next = this.$root.find(`[data-id="${current.row + 1}:0"]`)
        this.selection.select(next)
      } else {
        const next = this.$root.find(`[data-id="${current.row}:${current.col + 1}"]`)
        this.selection.select(next)
      }
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const current = this.selection.currentCell.id(true)

      if (current.row + 1 < this.rowsCount) {
        const next = this.$root.find(`[data-id="${current.row + 1}:${current.col}"]`)
        this.selection.select(next)
        next.focus()
      }
    }
  }
}

