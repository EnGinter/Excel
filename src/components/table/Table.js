import { ExcelComponent } from '@core/ExcelComponent';
import { createTable } from './table.template';
import { tableResize } from './table.resize';
import { TableSelection } from './TableSelection';
import { $ } from '@core/dom';
import {
  isCellLeftClick,
  matrix,
  shouldResize
} from './table.functions';

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
    Table.colsCount = colsCount
    Table.rowsCount = rowsCount

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
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Tab', 'Enter']

    if (keys.includes(event.key) && !event.shiftKey) {
      event.preventDefault()
      const current = this.selection.currentCell.id(true)
      const next = this.$root.find(nextSelector(event.key, current))

      this.selection.select(next)
      next.focus()
    }
  }
}

function nextSelector(key, {row, col}) {
  const MIN_VALUE = 0

  switch (key) {
    case 'Enter':
    case 'ArrowDown':
      row = row !== Table.rowsCount - 1 ? row + 1 : Table.rowsCount - 1
      break
    case 'Tab':
      if (col === Table.colsCount - 1) {
        col = 0
        row = row + 1
        break;
      }
    case 'ArrowRight':
      col = col !== Table.colsCount - 1 ? col + 1 : Table.colsCount - 1
      break;
    case 'ArrowLeft':
      col = col > MIN_VALUE ? col - 1 : MIN_VALUE
      break
    case 'ArrowUp':
      row = row > MIN_VALUE ? row - 1 : MIN_VALUE
      break
  }

  return `[data-id="${row}:${col}"]`
}
