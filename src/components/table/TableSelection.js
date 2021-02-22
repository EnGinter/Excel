const dataTags = {
  active: 'data-active',
  group: 'data-cell-group',
  name: 'data-name',
  boundaryY: 'data-cell-boundary-y',
  boundaryX: 'data-cell-boundary-x'
}

export class TableSelection {
  constructor(activeCellName, root) {
    this.activeCellName = activeCellName
    this.$root = root
    this._activeCellsVerticalGroup = [activeCellName]

    this._select()
  }

  _activeCells = []
  _verticalCellsCount = 0
  _horizontalCellsCount = 0
  _boundaryCells = []

  _select() {
    const currentActiveCell = this.$root.find(`[${dataTags.active}]`)

    if (currentActiveCell) {
      currentActiveCell.removeAttribute(dataTags.active)
      this._removeGroup()
      this._removeBoundary()
    }

    this.$root.find(`[${dataTags.name}=${this.activeCellName}]`).setAttribute(dataTags.active, true)

    this._selectGroup()
  }

  _selectGroup() {
    let previousVerticalCellsCount = 0
    let previousHorizontalCellsCount = 0

    const moveSelector = (e) => {
      const currentCell = e.target.dataset.name
      const verticalCellsCount = getVerticalCellsCount(this.activeCellName, currentCell)
      const horizontalCellsCount = getSelectedHorizontalCellsCount(this.activeCellName, currentCell)
      this._verticalCellsCount = verticalCellsCount
      this._horizontalCellsCount = horizontalCellsCount

      if (previousVerticalCellsCount !== verticalCellsCount) {
        previousVerticalCellsCount = verticalCellsCount

        this._setVerticalCellsGroup(verticalCellsCount)
        this._setActiveCellsGroup(horizontalCellsCount)
      }

      if (previousHorizontalCellsCount !== horizontalCellsCount) {
        previousHorizontalCellsCount = horizontalCellsCount

        this._setActiveCellsGroup(horizontalCellsCount)
      }
      if (this._activeCells.length === 1) {
        this._removeGroup()
        this._activeCells.length = 0
      } else if (this._activeCells.length > 1) {
        this._selectGroupedCell()
      }
    }

    const handleMousedown = () => {
      document.removeEventListener('mousemove', moveSelector)
      document.removeEventListener('mouseup', handleMousedown)

      if (this._activeCells.length > 1) {
        this._getBoundaryCellsData()

        this._boundaryCells.forEach(cell => {
          const $el = this.$root.find(`[${dataTags.name}=${cell.name}]`)

          $el.setAttribute(dataTags.boundaryY, cell.position.posY)
          $el.setAttribute(dataTags.boundaryX, cell.position.posX)
        })
      }
    }

    document.addEventListener('mousemove', moveSelector)
    document.addEventListener('mouseup', handleMousedown)
  }

  _getBoundaryCellsData() {
    const activeCellLetter = getCellLetter(this.activeCellName)
    const activeCellNumber = +getCellNumber(this.activeCellName)
    const lastCellLetter = String.fromCharCode(getCellLetterCharCode(activeCellLetter) + this._horizontalCellsCount)
    const lastCellNumber = activeCellNumber + this._verticalCellsCount

    const isActiveCellOnTop = this._verticalCellsCount > 0
    const isActiveCellOnLeft = this._horizontalCellsCount > 0
    const isCellsOnlyVertical = this._verticalCellsCount === 0
    const isCellsOnlyHorizontal = this._horizontalCellsCount === 0

    this._boundaryCells = this._activeCells.filter(cell => {
      if (getCellLetter(cell) === activeCellLetter
          || getCellNumber(cell) == activeCellNumber
          || getCellNumber(cell) == lastCellNumber
          || getCellLetter(cell) === lastCellLetter) {
        return true
      }
    }).map(cell => {
      let posX
      let posY

      if (isCellsOnlyHorizontal) {
        posX = 'both'
      } else {
        switch (getCellLetter(cell)) {
          case activeCellLetter:
            posX = isActiveCellOnLeft ? 'left' : 'right'
            break;

          case lastCellLetter:
            posX = isActiveCellOnLeft ? 'right' : 'left'
            break;
        }
      }

      if (isCellsOnlyVertical) {
        posY = 'both'
      } else {
        switch (+getCellNumber(cell)) {
          case activeCellNumber:
            posY = isActiveCellOnTop ? 'top' : 'bottom'
            break;

          case lastCellNumber:
            posY = isActiveCellOnTop ? 'bottom' : 'top'
            break;
        }
      }

      return {
        name: cell,
        position: {
          posX,
          posY
        }
      }
    })
  }

  _setVerticalCellsGroup(verticalCellsCount) {
    this._activeCellsVerticalGroup.length = 1

    for (let i = verticalCellsCount; i !== 0; verticalCellsCount > 0 ? i-- : i++ ) {
      this._activeCellsVerticalGroup.push(getVerticalCellNameByPosition(this.activeCellName, i))
    }
  }

  _setActiveCellsGroup(horizontalCellsCount) {
    if (this._activeCells.length > 1) {
      this._activeCells.length = 0
    }

    for (const verticalCell of this._activeCellsVerticalGroup) {
      this._activeCells.push(verticalCell)

      for (let i = horizontalCellsCount; i !== 0; horizontalCellsCount > 0 ? i-- : i++) {
        this._activeCells.push(getHorizontalCellNameByPosition(verticalCell, i))
      }
    }

    this._removeGroup()
  }

  _selectGroupedCell() {
    this._activeCells.forEach(cellName =>
      this.$root
          .find(`[${dataTags.name}=${cellName}]`)
          .setAttribute(dataTags.group, true))
  }

  _getSelectedCells() {
    return this.$root.findAll(`[${dataTags.group}]`)
  }

  _removeGroup() {
    this._getSelectedCells()
        .forEach(el => el.removeAttribute(dataTags.group))
  }

  _removeBoundary() {
    this.$root
        .findAll(`[${dataTags.boundaryY}]`)
        .forEach(el => {
          el.removeAttribute(dataTags.boundaryY)
          el.removeAttribute(dataTags.boundaryX)
        })
  }
}

function getVerticalCellNameByPosition(activeCell, additionalCellPosition) {
  const activeCellPosition = getCellNumber(activeCell)

  return activeCell.replace(activeCellPosition, +activeCellPosition + +additionalCellPosition)
}

function getHorizontalCellNameByPosition(activeCell, additionalCellPosition) {
  const activeCellLetter = getCellLetter(activeCell)

  return activeCell.replace(activeCellLetter, String.fromCharCode(getCellLetterCharCode(activeCell) + +additionalCellPosition))
}

function getVerticalCellsCount(activeCell, currentCell) {
  if (currentCell === null || activeCell === null) {
    return
  }
  return getCellNumber(currentCell) - getCellNumber(activeCell)
}

function getSelectedHorizontalCellsCount(activeCell, currentCell) {
  return getCellLetterCharCode(currentCell) - getCellLetterCharCode(activeCell)
}

function getCellNumber(str) {
  const regexp = /\d/g

  return str.match(regexp).join('')
}

function getCellLetter(str) {
  const regexp = /\D/g

  return str.match(regexp).join('')
}

function getCellLetterCharCode(str) {
  const regexp = /\D/g

  return str.match(regexp).join('').charCodeAt(0)
}
