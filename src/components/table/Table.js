import { ExcelComponent } from '@core/ExcelComponent';
import { createTable } from '@/components/table/table.template';
import { tableResize } from '@/components/table/table.resize';
import { TableSelection } from '@/components/table/TableSelection';

export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root) {
    super($root, {
      name: 'table',
      listeners: ['mousedown']
    });
  }

  toHTML() {
    return createTable()
  }

  prepare() {
    this.selection = new TableSelection()
  }

  init() {
    super.init()

    const $cell = this.$root.find(`data-id=0:0`)
    this.selection.select($cell)
  }

  onMousedown(event) {
    if (event.target.dataset.resize) {
      tableResize(event, this.$root)
    }
  }
}
