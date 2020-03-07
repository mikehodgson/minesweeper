/* eslint-disable no-console */
import "./css/minesweeper.less";

const _DEBUG: boolean = false;

class Cell {
    private minesNearby: number;

    constructor(public mine: boolean = false,
        public flag: boolean = false,
        public clear: boolean = false,
        public row: number = 0,
        public column: number = 0,
        public element: HTMLDivElement = document.createElement("div"),
        public board: Board = null,
    ) {
        if (_DEBUG) {
            console.info("Cell constructor start");
        }
        this.minesNearby = 0;

        this.element.className = "cell";
        this.element.onclick = () => {
            if (_DEBUG) {
                console.info("Cell left click");
            }
            this.processLeftClick();
            if (_DEBUG) {
                console.debug(this);
            }
            return false;
        };

        this.element.oncontextmenu = () => {
            if (_DEBUG) {
                console.info("Cell right click");
            }
            this.processRightClick();
            return false;
        };

        if (_DEBUG) {
            console.info("Cell constructor end");
        }
    }

    private clearNearbyCells(): void {
        /* clear any non-mine cells connected to this one */
        this.getNearbyCells().filter((cell) => cell.clear !== true).forEach((cell) =>
            cell.processLeftClick(),
        );
    }

    private calculateMinesNearby(): number {
        /* get the number of mines surrounding this cell */
        return this.getNearbyCells().filter((cell) => cell.mine).length;
    }

    private getNearbyCells(): Cell[] {
        /* grab an array of all cells surrounding this cell */
        return [
            this.board.getCell(this.row - 1, this.column),
            this.board.getCell(this.row - 1, this.column + 1),
            this.board.getCell(this.row, this.column + 1),
            this.board.getCell(this.row + 1, this.column + 1),
            this.board.getCell(this.row + 1, this.column),
            this.board.getCell(this.row + 1, this.column - 1),
            this.board.getCell(this.row, this.column - 1),
            this.board.getCell(this.row - 1, this.column - 1),
        ].filter((cell) => cell != null);
    }

    private processLeftClick(): void {
        /* process a left click event on this cell */
        if (!this.clear && !this.board.completed && !this.flag) {
            if (this.mine) {
                this.clear = true;
                this.element.className += " mine";
                this.element.innerHTML = "<span class=\"text\">&#x1F4A9;</span>";
                this.board.gameOver(false);
            } else {
                this.clear = true;
                this.minesNearby = this.calculateMinesNearby();
                if (this.minesNearby === 0) {
                    this.clearNearbyCells();
                } else {
                    this.element.className += " severity" + this.minesNearby;
                }
                this.element.className += " clear";
                if (this.minesNearby > 0) {
                    this.element.innerHTML = "<span class=\"text\">" + this.minesNearby + "</span>";
                }
            }
        }
        if (_DEBUG) {
            console.debug(this);
        }
    }

    private processRightClick(): void {
        /* process a right click event on this cell */
        if (!this.board.completed && !this.clear) {
            this.flag = !this.flag;
            if (_DEBUG) {
                console.log("flag: " + this.flag);
            }
            if (this.flag) {
                this.element.innerHTML = "<span class=\"text\">&#x1F3F3;&#xFE0F;</span>";
            } else {
                this.element.innerHTML = "";
            }
        }
    }
}

class Board {
    public cells: Cell[];
    public completed: boolean;

    constructor(public gridWidth: number, public gridHeight: number, public player: Player) {
        if (_DEBUG) {
            console.info("Board constructor start");
        }
        this.gridWidth = gridWidth || 24;
        this.gridHeight = gridHeight || 24;
        this.completed = false;
        this.cells = [];
        this.player.score = 0;

        if (_DEBUG) {
            console.debug({ gridHeight, gridWidth });
        }

        for (let r: number = 1; r <= gridHeight; r += 1) {
            for (let c: number = 1; c <= gridWidth; c += 1) {
                this.cells.push(new Cell(void 0, void 0, void 0, r, c, document.createElement("div"), this));
            }
        }
        this.setMines();
        if (_DEBUG) {
            console.info("Board constructor end");
        }
    }

    public draw(): void {
        if (_DEBUG) {
            console.info("draw start");
        }
        document.getElementById("container").innerHTML = "";
        this.cells.map((cell) => {
            document.getElementById("container").appendChild(cell.element);
            if (_DEBUG) {
                console.debug(cell);
            }
        });
        if (_DEBUG) {
            console.info("draw end");
        }
    }

    public setMines(): void {
        let counter: number = 0;
        if (_DEBUG) {
            console.info("setMines start");
        }
        while (counter < 20) {
            const item: Cell = this.cells[Math.floor(Math.random() * this.cells.length)];
            if (item.mine === false) {
                item.mine = true;
                counter++;
                console.debug(item);
            }
        }
        if (_DEBUG) {
            console.info("setMines end");
        }
    }

    public getMines(): Cell[] {
        return this.cells.filter((cell) => {
            return (cell.mine === true);
        });
    }

    public getCell(row: number, column: number): Cell {
        if (row > this.gridHeight || row < 1 || column > this.gridWidth || column < 1) {
            return null;
        }
        return this.cells.filter((cell) => cell.row === row && cell.column === column)[0];
    }

    public gameOver(success: boolean): void {
        if (!success) {
            console.info("lost");
            const audio: HTMLAudioElement = new Audio("sounds/price-is-right-losing-horn.mp3");
            audio.play();
        } else {
            console.info("won");
        }
        this.completed = true;
    }
}

class Player {
    public score: number;

    constructor(public name: string) {
        this.score = 0;
    }
}

class Game {
    public board: Board;
    public player: Player;

    constructor(private gridWidth: number, private gridHeight: number, private playerName: string) {
        this.player = new Player(this.playerName);
        this.board = new Board(this.gridWidth, this.gridHeight, this.player);
        this.board.draw();
        if (_DEBUG) {
            console.debug(this.board);
        }
    }
}

window.onload = () => {
    if (_DEBUG) { console.info("window.onload start"); }
    new Game(12, 12, "Unknown");
    if (_DEBUG) { console.info("window.onload end"); }
};
