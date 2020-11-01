const CODES = {
  A: 65,
  Z: 90
}

function createCol(content) {
  return `
     <div class="column" data-type="resizer" data-name=${content}>
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

function createCell(name) {
  return `
    <div class="cell" contenteditable="" data-name=${name}>
    </div>
  `
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

  for (let i = 0; i < rowsCount; i++) {
    const cells = new Array(colsCount)
        .fill('')
        .map(createChar)
        .map(el => createCell(el + (i + 1)))
        .join('')

    table.push(createRow(cells, i + 1))
  }

  return table.join('')
}
