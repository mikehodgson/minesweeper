import { Cell } from './cell';
import { Player } from './player';

export class Board {
    public cells: Cell[];
    public completed: boolean;
    public _DEBUG: boolean = false;

    constructor(public gridWidth: number, public gridHeight: number, public player: Player) {
        if (this._DEBUG) {
            console.info("Board constructor start");
        }
        this.gridWidth = gridWidth || 24;
        this.gridHeight = gridHeight || 24;
        this.completed = false;
        this.cells = [];
        this.player.score = 0;

        if (this._DEBUG) {
            console.debug({ gridHeight, gridWidth });
        }

        for (let r: number = 1; r <= gridHeight; r += 1) {
            for (let c: number = 1; c <= gridWidth; c += 1) {
                this.cells.push(new Cell(void 0, void 0, void 0, r, c, document.createElement("div"), this));
            }
        }
        this.setMines();
        if (this._DEBUG) {
            console.info("Board constructor end");
        }
    }

    public draw(): void {
        if (this._DEBUG) {
            console.info("draw start");
        }
        const myElement = document.getElementById("container")!;
        myElement.innerHTML = "";
        this.cells.map((cell) => {
            myElement.appendChild(cell.element);
            if (this._DEBUG) {
                console.debug(cell);
            }
        });
        if (this._DEBUG) {
            console.info("draw end");
        }
    }

    public setMines(): void {
        let counter: number = 0;
        if (this._DEBUG) {
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
        if (this._DEBUG) {
            console.info("setMines end");
        }
    }

    public getMines(): Cell[] {
        return this.cells.filter((cell) => {
            return (cell.mine === true);
        });
    }

    public getCell(row: number, column: number): Cell | null {
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