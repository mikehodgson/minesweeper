/* eslint-disable no-console */
require("./css/minesweeper.less");

import { Game } from "../src/model/game";

const _DEBUG: boolean = false;

window.onload = () => {
    new Game(12, 12, "Unknown");
};
