import {range} from '../../Core/utils'

export function isCellLeftClick(event) {
  return event.target.dataset.id && event.button === 0
}

export function shouldResize(event) {
  return event.target.dataset.resize
}

export function matrix(target, current) {
  const cols = range(target.col, current.col)
  const rows = range(target.row, current.row)

  const $selectedCells = rows.reduce((acc, row) => {
    cols.forEach(col => acc.push(`${row}:${col}`))
    return acc
  }, [])

  return $selectedCells
}
