/* global Audio */

const style = require('./css/minesweeper.less')

const _debug = true

class Cell {
    minesNearby : number;

    constructor(public mine : boolean = false, public flag : boolean = false, public clear : boolean = false, public row : number = 0, public column : number = 0, public element : HTMLDivElement = document.createElement('div'), public board : Board = null) {
        if (_debug) console.info('Cell constructor start')
        this.minesNearby = 0

        this.element.className = 'cell'
        this.element.onclick = () => {
            if (_debug) console.info('Cell left click')
            this.processLeftClick()
            if (_debug) console.debug(this)
            return false
        }
        this.element.oncontextmenu = () => {
            if (_debug) console.info('Cell right click')
            this.processRightClick()
            return false
        }
        if (_debug) console.info('Cell constructor end')
    }
    clearNearbyCells() {
        /* Clear any non-mine cells connected to this one */
        this.getNearbyCells().filter(cell => cell.clear !== true).forEach(cell =>
            cell.processLeftClick()
        )
    }
    calculateMinesNearby() {
        /* Get the number of mines surrounding this cell */
        return this.getNearbyCells().filter(cell => cell.mine).length
    }
    getNearbyCells() {
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
    processLeftClick() {
        /* Process a left click event on this cell */
        if (!this.clear && !this.board.completed && !this.flag) {
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
        if (_debug) console.debug(this)
    }
    processRightClick() {
        /* Process a right click event on this cell */
        if (!this.board.completed && !this.clear) {
            this.flag = !this.flag
            if (this.flag) {
                this.element.innerHTML = '<span class="text">🏳️</span>'
            } else {
                this.element.innerHTML = ''
            }
        }
    }
}

class Board {
    completed : boolean;
    cells : Array<Cell>;

    constructor(public gridWidth : number, public gridHeight : number) {
        if (_debug) console.info('Board constructor start')
        this.gridWidth = gridWidth || 24
        this.gridHeight = gridHeight || 24
        this.completed = false
        this.cells = []
        if (_debug) console.debug({ gridHeight, gridWidth })

        for (let r = 1; r <= gridHeight; r += 1) {
            for (let c = 1; c <= gridWidth; c += 1) {
                this.cells.push(new Cell(void 0, void 0, void 0, r, c, document.createElement('div'), this))
            }
        }
        this.setMines()
        if (_debug) console.info('Board constructor end')
    }

    async draw() {
        if (_debug) console.info('draw start')
        document.getElementById('container').innerHTML = ''
        this.cells.map(function (cell) {
            document.getElementById('container').appendChild(cell.element)
            if (_debug) console.debug(cell)
        })
        if (_debug) console.info('draw end')
    }

    async setMines() {
        let counter = 0
        if (_debug) console.info('setMines start')
        while (counter < 20) {
            let item = this.cells[Math.floor(Math.random() * this.cells.length)]
            if (item.mine === false) {
                item.mine = true
                counter++
                console.debug(item)
            }
        }
        if (_debug) console.info('setMines end')
    }

    getMines() {
        return this.cells.filter(function (cell) {
            return (cell.mine === true)
        })
    }

    getCell(row : number, column : number) {
        if (row > this.gridHeight || row < 1 || column > this.gridWidth || column < 1) {
            return null
        }
        return this.cells.filter(cell => cell.row === row && cell.column === column)[0]
    }

    gameOver(success : boolean) {
        if (!success) {
            console.info('lost')
            var audio = new Audio('sounds/price-is-right-losing-horn.mp3')
            audio.play()
        } else {
            console.info('won')
        }
        this.completed = true
    }
}

window.onload = async function () {
    if (_debug) console.info('window.onload start')
    let board = new Board(12, 12)
    await board.draw()
    if (_debug) console.debug(board)
    if (_debug) console.info('window.onload end')
}
