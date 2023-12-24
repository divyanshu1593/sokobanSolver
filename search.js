const Board = require('./board.js');

class Search {
    static search(board, movesMade){
        if (board.isFinalState()) return movesMade;

        let possibleMoves = [];
        let possibleDirs = ['w', 'a', 's', 'd'];

        let max = -Infinity;

        for (let dir of possibleDirs){
            let boardClone = structuredClone(board);
            boardClone.__proto__ = board.__proto__;

            if (boardClone.move(dir)){
                let cost = Search.#evaluate(boardClone.state);
                max = Math.max(max, cost);
                possibleMoves.push([cost, dir]);
            }
        }

        let indexesOfCandidateMoves = [];
        for (let i = 0; i < possibleMoves.length; i++){
            if (possibleMoves[i][0] == max){
                indexesOfCandidateMoves.push(i);
            }
        }

        let index = Math.floor(Math.random() * ((indexesOfCandidateMoves.length - 1) + 1));
        let moveDir = possibleMoves[indexesOfCandidateMoves[index]][1];

        board.move(moveDir);
        movesMade.push(moveDir);
        console.log();
        board.show();

        return Search.search(board, movesMade);
    }

    static #evaluate(state){
        let evaluation = 0;
        let punishmentWeight = -1;
        let rewardWeight = 1;

        for (let i of state){
            for (let j of i){
                if (j == Board.BOX_AT_EMPTY_SPACE){
                    evaluation += punishmentWeight;
                } else if (j == Board.BOX_AT_VALID_SPACE){
                    evaluation += rewardWeight;
                }
            }
        }

        return evaluation;
    }
}

let levels = {
    level1: [
        [0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 4, 1, 0, 0, 0],
        [0, 0, 1, 0, 1, 1, 1, 1],
        [1, 1, 1, 2, 0, 2, 4, 1],
        [1, 4, 0, 2, 5, 1, 1, 1],
        [1, 1, 1, 1, 2, 1, 0, 0],
        [0, 0, 0, 1, 4, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 0, 0]
    ],

    level2: [
        [1, 1, 1, 1, 1, 0, 0, 0, 0],
        [1, 5, 0, 0, 1, 0, 0, 0, 0],
        [1, 0, 2, 2, 1, 0, 1, 1, 1],
        [1, 0, 2, 0, 1, 0, 1, 4, 1],
        [1, 1, 1, 0, 1, 1, 1, 4, 1],
        [0, 1, 1, 0, 0, 0, 0, 4, 1],
        [0, 1, 0, 0, 0, 1, 0, 0, 1],
        [0, 1, 0, 0, 0, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 1, 0, 0, 0],
    ],
}

let ans = Search.search(new Board(levels.level1), []);
console.log(ans);