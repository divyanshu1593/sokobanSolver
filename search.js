const Board = require('./board.js');
const levels = require('./levels.js');
const prompt = require('prompt-sync')({sigint: true});

class Search {
    static search(board, movesMade, visitedState){
        board.show();
        console.log();
        if (board.isFinalState()) return movesMade;
        if (board.isDeadState()){
            console.log("dead state detacted");
            return null;
        }

        let hashValue = JSON.stringify(board.state);
        if (visitedState.has(hashValue)){
            console.log("same position reached");
            return null;
        }
        visitedState.add(hashValue);

        let possibleMoves = [];
        let possibleDirs = ['w', 'a', 's', 'd'];

        for (let dir of possibleDirs){
            let boardClone = structuredClone(board);
            boardClone.__proto__ = board.__proto__;

            if (boardClone.move(dir)){
                let evaluation = Search.#evaluate(boardClone.state);
                possibleMoves.push([evaluation, dir]);
            }
        }

        possibleMoves.sort((a, b) => b[0] - a[0]);

        for (let move of possibleMoves){
            let cloneBoard = structuredClone(board);
            cloneBoard.__proto__ = board.__proto__;

            cloneBoard.move(move[1]);
            let movesMadeClone = movesMade.map(val => val);
            movesMadeClone.push(move[1]);

            let result = Search.search(cloneBoard, movesMadeClone, visitedState);
            if (result) return result;
        }

        return null;
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

    static animateMoves(board, moves){
        for (let mv of moves){
            console.clear();
            board.show();
            console.log();
            prompt("press any key to continue");
            board.move(mv);
        }

        console.clear();
        board.show();
        console.log(moves.length);
    }
}

let ans = Search.search(new Board(levels.level2), [], new Set());
console.log(ans);

Search.animateMoves(new Board(levels.level2), ans);