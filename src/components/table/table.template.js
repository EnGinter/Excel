const CODES = {
  A: 65,
  Z: 90
}

function createCol(content, index) {
  return `
     <div class="column" data-type="resizer" data-column=${index}>
        ${content}
        <div class="col-resize" data-resize="col"></div>
     </div>
  `
}

function createRow(content = '', index = '') {
  const resized = index
      ? `<div class="row-resize" data-resize="row"></div>`
      : ''

  return `
     <div class="row" data-type="resizer">
        <div class="row-info">
            ${index}
            ${resized}
        </div>
        <div class="row-data">${content}</div>
     </div>
  `
}

function createCell(row) {
  return function(_, col) {
    return `
    <div 
      class="cell" 
      contenteditable="" 
      data-column="${col}" 
      data-id="${row}:${col}"
      data-type="cell"
      >
    </div>
  `
  }
}

function createChar(_, index) {
  return String.fromCharCode(CODES.A + index)
}

export function createTable(rowsCount = 25) {
  const colsCount = CODES.Z - CODES.A + 1
  const table = []

  const cols = new Array(colsCount)
      .fill('')
      .map(createChar)
      .map(createCol)
      .join('')

  table.push(createRow(cols))

  for (let row = 0; row < rowsCount; row++) {
    const cells = new Array(colsCount)
        .fill('')
        .map(createCell(row))
        .join('')

    table.push(createRow(cells, row + 1))
  }

  return {
    html: table.join(''),
    rowsCount,
    colsCount,
  }
}
