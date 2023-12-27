const Board = require('./board');
const prompt = require('prompt-sync')({sigint: true});
const levels = require('./levels');

let board = new Board(levels.level2);

let validMove = /^[w|a|s|d]$/;

while (!board.isFinalState()){
    console.clear();
    board.show();
    let ch = prompt("Enter the Dir: ");
    if (validMove.test(ch)) board.move(ch);
}

console.clear();
board.show()