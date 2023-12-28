const Board = require('./board.js');
const levels = require('./levels.js');
const prompt = require('prompt-sync')({sigint: true});

class Search {
    static search(board, movesMade, visitedState, boxPlacedWeight, averageDistanceWeight, awayFromBoxWeight, debug = false){
        if (debug){
            board.show();
            console.log();
        }
        if (board.isFinalState()) return movesMade;
        if (board.isDeadState()){
            if (debug) console.log("dead state detacted");
            return null;
        }

        let hashValue = JSON.stringify(board.state);
        if (visitedState.has(hashValue)){
            if (debug) console.log("same position reached");
            return null;
        }
        visitedState.add(hashValue);

        let possibleMoves = [];
        let possibleDirs = ['w', 'a', 's', 'd'];

        for (let dir of possibleDirs){
            let boardClone = structuredClone(board);
            boardClone.__proto__ = board.__proto__;

            if (boardClone.move(dir)){
                let evaluation = Search.#evaluate(boardClone.state, board.state, boxPlacedWeight, averageDistanceWeight, awayFromBoxWeight);
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

    static #evaluate(state, prevState, boxPlacedWeight, averageDistanceWeight, awayFromBoxWeight){
        let evaluation = 0;
        let boxPlaced = 0;
        let boxPositions = [];
        let validPositions = [];

        for (let i = 0; i < state.length; i++){
            for (let j = 0; j < state[0].length; j++){
                if (state[i][j] == Board.BOX_AT_EMPTY_SPACE){
                    boxPositions.push([i, j]);
                } else if (state[i][j] == Board.BOX_AT_VALID_SPACE){
                    boxPlaced += 1;
                    boxPositions.push([i, j]);
                    validPositions.push([i, j]);
                } else if (state[i][j] == Board.VALID_SPACE){
                    validPositions.push([i, j]);
                }
            }
        }

        // scaling the boxPlaced to fit in 1 to 10 range
        let scaledBoxPlaced = Math.trunc((boxPlaced / boxPositions.length) * 10);
        if (scaledBoxPlaced != 10) scaledBoxPlaced += 1;

        let averageDistanceSum = 0;

        for (let boxPos of boxPositions){
            let distSum = 0;
            for (let validPos of validPositions){
                distSum += (Math.max(boxPos[0], validPos[0]) - Math.min(boxPos[0], validPos[0]));
                distSum += (Math.max(boxPos[1], validPos[1]) - Math.min(boxPos[1], validPos[1]));
            }
            averageDistanceSum += (distSum / validPositions.length);
        }

        let averageDistance = averageDistanceSum / boxPositions.length;

        // scaling the distance to fit in 1 to 10 range
        let maxPossibleDistance = (state.length - 1) + (state[0].length - 1);
        let scaledAverageDistance = (Math.trunc((averageDistance / maxPossibleDistance) * 10));
        if (scaledAverageDistance != 10) scaledAverageDistance += 1;

        // inverting the scaledAverageDistance so that 1, 2, ..., 10 get converted to 10, 9, ..., 1
        scaledAverageDistance = ((scaledAverageDistance - 11) * -1);

        function isAdjecentToEmptyBox(state){
            let playerPos = Board.findPlayerPosition(state);
            if (state[playerPos.i + 1][playerPos.j] == Board.BOX_AT_EMPTY_SPACE ||
                state[playerPos.i][playerPos.j + 1] == Board.BOX_AT_EMPTY_SPACE ||
                state[playerPos.i - 1][playerPos.j] == Board.BOX_AT_EMPTY_SPACE ||
                state[playerPos.i][playerPos.j - 1] == Board.BOX_AT_EMPTY_SPACE ||
                state[playerPos.i - 1][playerPos.j - 1] == Board.BOX_AT_EMPTY_SPACE ||
                state[playerPos.i - 1][playerPos.j + 1] == Board.BOX_AT_EMPTY_SPACE ||
                state[playerPos.i + 1][playerPos.j - 1] == Board.BOX_AT_EMPTY_SPACE ||
                state[playerPos.i + 1][playerPos.j + 1] == Board.BOX_AT_EMPTY_SPACE){
                    return true
                }
            return false;
        }
        // going away from unplaced box
        let awayFromBoxEval;
        if (isAdjecentToEmptyBox(prevState)){
            if (isAdjecentToEmptyBox(state)){
                awayFromBoxEval = 10;
            } else {
                awayFromBoxEval = 1;
            }
        } else {
            awayFromBoxEval = 5;
        }

        evaluation += ((scaledBoxPlaced * boxPlacedWeight) + (scaledAverageDistance * averageDistanceWeight) + (awayFromBoxEval * awayFromBoxWeight));

        // TO BE DONE: changing direction as a hueristic

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

let ans = Search.search(new Board(levels.level4), [], new Set(), 4, 2, 7);
console.log(ans);

Search.animateMoves(new Board(levels.level4), ans);

module.exports = Search;