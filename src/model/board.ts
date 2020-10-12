import { Cell } from "./cell";
import { Player } from "./player";

export class Board {
    public cells: Cell[];
    public completed: boolean;

    constructor(public gridWidth: number, public gridHeight: number, public player: Player) {
        this.gridWidth = gridWidth || 24;
        this.gridHeight = gridHeight || 24;
        this.completed = false;
        this.cells = [];
        this.player.score = 0;

        for (let r: number = 1; r <= gridHeight; r += 1) {
            for (let c: number = 1; c <= gridWidth; c += 1) {
                this.cells.push(new Cell(void 0, void 0, void 0, r, c, document.createElement("div"), this));
            }
        }
        this.setMines();
    }

    public draw(): void {
        const myElement: Element = document.getElementById("container")!;
        myElement.innerHTML = "";
        this.cells.map((cell) => {
            myElement.appendChild(cell.element);
        });
    }

    public setMines(): void {
        let counter: number = 0;
        while (counter < 20) {
            const item: Cell = this.cells[Math.floor(Math.random() * this.cells.length)];
            if (item.mine === false) {
                item.mine = true;
                counter++;
            }
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
        if (success) {
            // win
        } else {
            // loss
            const audio: HTMLAudioElement = new Audio("sounds/price-is-right-losing-horn.mp3");
            audio.play();
        }
        this.completed = true;
    }
}