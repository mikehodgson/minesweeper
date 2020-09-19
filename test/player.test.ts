const jsdom = require('mocha-jsdom');
import {expect} from 'chai';
import {Player} from '../src/model/player';
import 'mocha';

describe("Player", () => {
    const player: Player = new Player("test");

    it("score is equal to 0 to start", () => {
        expect(player.score).to.equal(0);
    });

    it("name should be test", () => {
        expect(player.name).to.equal('test');
    });
});