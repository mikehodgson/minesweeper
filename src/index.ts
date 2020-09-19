/* eslint-disable no-console */
require("./css/minesweeper.less");

import { Game } from '../src/model/game';

const _DEBUG: boolean = false;

window.onload = () => {
    if (_DEBUG) { console.info("window.onload start"); }
    new Game(12, 12, "Unknown");
    if (_DEBUG) { console.info("window.onload end"); }
};
