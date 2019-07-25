/* global Audio */

import style from '../css/minesweeper.less'

const _debug = false

let Cell = class {
  constructor (options) {
    if (_debug) console.log('Cell constructor start')
    this.minesNearby = 0
    this.mine = options.mine || false
    this.flag = options.flag || false
    this.clear = options.clear || false
    this.row = options.row || 0
    this.column = options.column || 0
    this.element = options.element || document.createElement('div')
    this.board = options.board || null

    this.element.className = 'cell'
    this.element.onclick = () => {
      if (_debug) console.log('Cell left click')
      this.processLeftClick()
      if (_debug) console.log(this)
      return false
    }
    this.element.oncontextmenu = () => {
      if (_debug) console.log('Cell right click')
      this.processRightClick()
      return false
    }
    if (_debug) console.log('Cell constructor end')
  }
  clearNearbyCells () {
    /* Clear any non-mine cells connected to this one */
    this.getNearbyCells().filter(cell => cell.clear !== true).forEach(cell =>
      cell.processLeftClick()
    )
  }
  calculateMinesNearby () {
    /* Get the number of mines surrounding this cell */
    return this.getNearbyCells().filter(cell => cell.mine).length
  }
  getNearbyCells () {
    /* Grab an array of all cells surrounding this cell */
    return [
      this.board.getCell(this.row - 1, this.column),
      this.board.getCell(this.row - 1, this.column + 1),
      this.board.getCell(this.row, this.column + 1),
      this.board.getCell(this.row + 1, this.column + 1),
      this.board.getCell(this.row + 1, this.column),
      this.board.getCell(this.row + 1, this.column - 1),
      this.board.getCell(this.row, this.column - 1),
      this.board.getCell(this.row - 1, this.column - 1)
    ].filter(cell => cell != null)
  }
  processLeftClick () {
    /* Process a left click event on this cell */
    if (!this.clear && !this.board.completed) {
      if (this.mine) {
        this.clear = true
        this.element.className += ' mine'
        this.element.innerHTML = '<span class="text">💩</span>'
        this.board.gameOver(false)
      } else {
        this.clear = true
        this.minesNearby = this.calculateMinesNearby()
        if (this.minesNearby === 0) {
          this.clearNearbyCells()
        } else {
          this.element.className += ' severity' + this.minesNearby
        }
        this.element.className += ' clear'
        if (this.minesNearby > 0) {
          this.element.innerHTML = '<span class="text">' + this.minesNearby + '</span>'
        }
      }
    }
    if (_debug) console.log(this)
  }
  processRightClick () {
    /* Process a right click event on this cell */
    if (!this.board.completed) {
      this.clear = !this.clear
      this.flag = !this.flag
      if (this.flag) {
        this.element.innerHTML = '<span class="text">🏳️</span>'
      } else {
        this.element.innerHTML = ''
      }
    }
  }
}

let Board = class {
  constructor (gridWidth, gridHeight) {
    if (_debug) console.log('Board constructor start')
    this.gridWidth = gridWidth || 24
    this.gridHeight = gridHeight || 24
    this.completed = false
    this.cells = []
    if (_debug) console.log({ gridHeight, gridWidth })

    for (let r = 1; r <= gridHeight; r += 1) {
      for (let c = 1; c <= gridWidth; c += 1) {
        this.cells.push(new Cell({ row: r, column: c, element: document.createElement('div'), board: this }))
      }
    }
    this.setMines()
    if (_debug) console.log('Board constructor end')
  }

  draw () {
    if (_debug) console.log('draw start')
    document.getElementById('container').innerHTML = ''
    this.cells.map(function (cell) {
      document.getElementById('container').appendChild(cell.element)
      if (_debug) console.log(cell)
    })
    if (_debug) console.log('draw end')
  }

  setMines () {
    let counter = 0
    if (_debug) console.log('setMines start')
    while (counter < 20) {
      let item = this.cells[Math.floor(Math.random() * this.cells.length)]
      if (item.mine === false) {
        item.mine = true
        counter++
        console.log(item)
      }
    }
    if (_debug) console.log('setMines end')
  }

  getMines () {
    return this.cells.filter(function (cell) {
      return (cell.mine === true)
    })
  }

  getCell (row, column) {
    if (row > this.gridHeight || row < 1 || column > this.gridWidth || column < 1) {
      return null
    }
    return this.cells.filter(cell => cell.row === row && cell.column === column)[0]
  }

  gameOver (success) {
    if (!success) {
      console.log('lost')
      var audio = new Audio('sounds/price-is-right-losing-horn.mp3')
      audio.play()
    }
    this.completed = true
  }
}

window.onload = function () {
  if (_debug) console.log('window.onload start')
  let board = new Board(12, 12)
  board.draw()
  if (_debug) console.log(board)
  if (_debug) console.log('window.onload end')
}
