import { Board } from './board';

export class Cell {
    private minesNearby: number;
    public _DEBUG: boolean = false;

    constructor(public mine: boolean = false,
        public flag: boolean = false,
        public clear: boolean = false,
        public row: number = 0,
        public column: number = 0,
        public element: HTMLDivElement = document.createElement("div"),
        public board: Board
    ) {
        if (this._DEBUG) {
            console.info("Cell constructor start");
        }
        this.minesNearby = 0;

        this.element.className = "cell";
        this.element.onclick = () => {
            if (this._DEBUG) {
                console.info("Cell left click");
            }
            this.processLeftClick();
            if (this._DEBUG) {
                console.debug(this);
            }
            return false;
        };

        this.element.oncontextmenu = () => {
            if (this._DEBUG) {
                console.info("Cell right click");
            }
            this.processRightClick();
            return false;
        };

        if (this._DEBUG) {
            console.info("Cell constructor end");
        }
    }

    private clearNearbyCells(): void {
        /* clear any non-mine cells connected to this one */
        this.getNearbyCells().filter((cell) => cell!.clear !== true).forEach((cell) =>
            cell!.processLeftClick(),
        );
    }

    private calculateMinesNearby(): number {
        /* get the number of mines surrounding this cell */
        return this.getNearbyCells().filter((cell) => cell!.mine).length;
    }

    private getNearbyCells(): (Cell | null)[] {
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
                this.board.player.score += 1;
                console.log('score: ' + this.board.player.score);
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
        if (this._DEBUG) {
            console.debug(this);
        }
    }

    private processRightClick(): void {
        /* process a right click event on this cell */
        if (!this.board.completed && !this.clear) {
            this.flag = !this.flag;
            if (this._DEBUG) {
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