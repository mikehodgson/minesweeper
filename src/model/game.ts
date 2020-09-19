import { Board } from './board';
import { Player } from './player';

export class Game {
    public board: Board;
    public player: Player;
    public _DEBUG: boolean = false;

    constructor(private gridWidth: number, private gridHeight: number, private playerName: string) {
        this.player = new Player(this.playerName);
        this.board = new Board(this.gridWidth, this.gridHeight, this.player);
        this.board.draw();
        if (this._DEBUG) {
            console.debug(this.board);
        }
    }
}