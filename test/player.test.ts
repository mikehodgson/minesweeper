import {assert, expect} from "chai";
import {Player} from "../src/model/player";
import "chai/register-should";
import "mocha";

describe("Player", () => {
    const player: Player = new Player("test");

    it("should have an initial score of 0", () => {
        expect(player.score).to.equal(0);
    });

    it("should have name equal to 'test'", () => {
        expect(player.name).to.equal("test");
    });
});