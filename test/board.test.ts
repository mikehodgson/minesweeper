import {assert, expect} from "chai";
import {Board} from "../src/model/board";
import {Player} from "../src/model/player";
import "mocha";

describe("Board", () => {
    const player: Player = new Player("test");
    const board: Board = new Board(24, 24, player);

    it("should have width equal to 24", () => {
        expect(board.gridWidth).to.equal(24);
    });

    it("should have height equal to 24", () => {
        expect(board.gridHeight).to.equal(24);
    });

    it("should have 576 cells", () => {
        expect(board.cells.length).to.equal(576);
    });

    it("should have some mines set", () => {
        expect(board.getMines().length).to.be.greaterThan(0);
    });

    it("should be able to get a cell", () => {
        expect(board.getCell(1,1)).to.not.equal(null);
    });
});