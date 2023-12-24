const Board = require('./board');
const prompt = require('prompt-sync')({sigint: true});

let level1 = [
    [0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 4, 1, 0, 0, 0],
    [0, 0, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 2, 0, 2, 4, 1],
    [1, 4, 0, 2, 5, 1, 1, 1],
    [1, 1, 1, 1, 2, 1, 0, 0],
    [0, 0, 0, 1, 4, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 0, 0]
];

let board = new Board(level1);

let validMove = /^[w|a|s|d]$/;

while (!board.isFinalState()){
    console.clear();
    board.show();
    let ch = prompt("Enter the Dir: ");
    if (validMove.test(ch)) board.move(ch);
}

console.clear();
board.show()