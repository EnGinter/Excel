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

  onMousedown(event) {
    if (event.target.dataset.resize) {
      tableResize(event, this.$root)
    }

    if (event.target.dataset.name && event.button === 0) {
      new TableSelection(event.target.dataset.name, this.$root)
    }
  }
}
