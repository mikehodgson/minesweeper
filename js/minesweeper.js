var _debug = true

function Cell (options) {
  let _self = this
  this.mine = options.mine || false
  this.flag = options.flag || false
  this.clear = options.clear || false
  this.row = options.row || 0
  this.column = options.column || 0
  this.element = options.element || document.createElement('div')

  this.element.className = 'cell'
  this.element.onclick = function () {
    if (_debug) console.log('cell click')
    if (_debug) console.log(_self)
    if (_self.mine && !_self.clear) {
      _self.clear = true
      _self.element.className += ' mine fas fa-bomb'
    }
    return false
  }
  this.element.oncontextmenu = function () {
    if (!_self.clear) {
      _self.clear = true
      _self.flag = true
      _self.element.className += ' flag fas fa-flag'
    }
    return false
  }
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
        _self.cells.push(new Cell({ row: r, column: c, element: document.createElement('div') }))
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
    while (counter < 15) {
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

  let _self = this

  this.init()
}

window.onload = function () {
  if (_debug) console.log('window.onload start')
  let board = new Board(24, 24)
  board.draw()
  if (_debug) console.log(board)
  if (_debug) console.log('window.onload end')
}
