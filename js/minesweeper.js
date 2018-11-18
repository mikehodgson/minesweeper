var _debug = true

function Cell (options) {
  this.minesNearby = 0
  this.mine = options.mine || false
  this.flag = options.flag || false
  this.clear = options.clear || false
  this.row = options.row || 0
  this.column = options.column || 0
  this.element = options.element || document.createElement('div')
  this.board = options.board || null

  this.element.className = 'cell'
  this.element.onclick = function () {
    if (_debug) console.log('cell click')
    _self.processClick()
    if (_debug) console.log(_self)
    return false
  }
  this.element.oncontextmenu = function () {
    if (!_self.clear) {
      _self.clear = true
      _self.flag = true
      _self.element.innerHTML = '<span class="text">🏳️</span>'
    }
    return false
  }
  this.clearNearbyCells = function () {
    _self.getNearbyCells().filter(cell => cell.clear !== true).forEach(cell =>
      cell.processClick()
    )
  }
  this.calculateMinesNearby = function () {
    return _self.getNearbyCells().filter(cell => cell.mine).length
  }
  this.getNearbyCells = function () {
    return [
      _self.board.getCell(_self.row - 1, _self.column),
      _self.board.getCell(_self.row - 1, _self.column + 1),
      _self.board.getCell(_self.row, _self.column + 1),
      _self.board.getCell(_self.row + 1, _self.column + 1),
      _self.board.getCell(_self.row + 1, _self.column),
      _self.board.getCell(_self.row + 1, _self.column - 1),
      _self.board.getCell(_self.row, _self.column - 1),
      _self.board.getCell(_self.row - 1, _self.column - 1)
    ].filter(cell => cell != null)
  }
  this.processClick = function () {
    if (!_self.clear) {
      if (_self.mine) {
        _self.clear = true
        _self.element.className += ' mine'
        _self.element.innerHTML = '<span class="text">💣</span>'
      } else {
        _self.clear = true
        _self.minesNearby = _self.calculateMinesNearby()
        if (_self.minesNearby === 0) {
          _self.clearNearbyCells()
        } else {
          _self.element.className += ' severity' + _self.minesNearby
        }
        _self.element.className += ' clear'
        if (_self.minesNearby > 0) {
          _self.element.innerHTML = '<span class="text">' + _self.minesNearby + '</span>'
        }
      }
    }
    if (_debug) console.log(_self)
  }

  let _self = this
}

function Board (gridWidth, gridHeight) {
  this.gridWidth = gridWidth || 24
  this.gridHeight = gridHeight || 24
  this.cells = []

  this.init = function () {
    if (_debug) console.log('init start')
    if (_debug) console.log({ gridHeight, gridWidth })

    for (let r = 1; r <= gridHeight; r++) {
      for (let c = 1; c <= gridWidth; c++) {
        _self.cells.push(new Cell({ row: r, column: c, element: document.createElement('div'), board: _self }))
      }
    }
    this.setMines()
    if (_debug) console.log('init end')
  }

  this.draw = function () {
    if (_debug) console.log('drawCells start')
    _self.cells.map(function (cell) {
      document.getElementById('container').appendChild(cell.element)
      if (_debug) console.log(cell)
    })
    if (_debug) console.log('drawCells end')
  }

  this.setMines = function () {
    let counter = 0
    if (_debug) console.log('setMines start')
    while (counter < 20) {
      let item = _self.cells[Math.floor(Math.random() * _self.cells.length)]
      if (item.mine === false) {
        item.mine = true
        counter++
        console.log(item)
      }
    }
    if (_debug) console.log('setMines end')
  }

  this.getMines = function () {
    return _self.cells.filter(function (cell) {
      return (cell.mine === true)
    })
  }

  this.getCell = function (row, column) {
    if (row > _self.gridHeight || row < 1 || column > _self.gridWidth || column < 1) {
      return null
    }
    return _self.cells.filter(cell => cell.row === row && cell.column === column)[0]
  }

  let _self = this

  this.init()
}

window.onload = function () {
  if (_debug) console.log('window.onload start')
  let board = new Board(12, 12)
  board.draw()
  if (_debug) console.log(board)
  if (_debug) console.log('window.onload end')
}
