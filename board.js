class Board {
    constructor(initState){
        // state is a m * n matrix where:
        // 0 means empty space
        // 1 means walls
        // 2 means box (not at place)
        // 3 means box (at place)
        // 4 means valid empty place for box
        // 5 means the player
        // 6 means the player at a valid empty 
        this.state = initState;
        this.playerPos = Board.#findPlayerPosition(initState);
    }

    static EMPTY_SPACE = 0;
    static WALL = 1;
    static BOX_AT_EMPTY_SPACE = 2;
    static BOX_AT_VALID_SPACE = 3;
    static VALID_SPACE = 4;
    static PLAYER_AT_EMPTY_SPACE = 5;
    static PLAYER_AT_VALID_SPACE = 6;

    static #findPlayerPosition(state){
        for (let i = 0; i < state.length; i++){
            for (let j = 0; j < state[0].length; j++){
                if (state[i][j] == Board.PLAYER_AT_EMPTY_SPACE || state[i][j] == Board.PLAYER_AT_VALID_SPACE){
                    return {i, j}
                }
            }
        }
    }

    show(){
        for (let i of this.state){
            let temp = [];

            for (let j of i){
                if (j == Board.VALID_SPACE){
                    temp.push(991);
                } else if (j == Board.EMPTY_SPACE){
                    temp.push(32);
                } else if (j == Board.WALL){
                    temp.push(9608);
                } else if (j == Board.BOX_AT_EMPTY_SPACE){
                    temp.push(9633);
                } else if (j == Board.BOX_AT_VALID_SPACE){
                    temp.push(9632);
                } else if (j == Board.PLAYER_AT_EMPTY_SPACE || j == PLAYER_AT_VALID_SPACE){
                    temp.push(64);
                }
                temp.push(32)
            }
            console.log(String.fromCharCode(...temp));
        }
    }

    move(moveDir){
        let a, b;
        if (moveDir == 'w'){
            a = -1;
            b = 0;
        } else if (moveDir == 'a'){
            a = 0;
            b = -1;
        } else if (moveDir == 's'){
            a = 1;
            b = 0;
        } else if (moveDir == 'd'){
            a = 0;
            b = 1;
        }

        let cur = this.state[this.playerPos.i][this.playerPos.j];
        let nextInDir = this.state[this.playerPos.i + a][this.playerPos.j + b];

        if (nextInDir == Board.EMPTY_SPACE || nextInDir == Board.VALID_SPACE){
            if (cur == Board.PLAYER_AT_EMPTY_SPACE){
                this.state[this.playerPos.i][this.playerPos.j] = Board.EMPTY_SPACE;
            } else {
                this.state[this.playerPos.i][this.playerPos.j] = Board.VALID_SPACE;
            }
            if (nextInDir == Board.EMPTY_SPACE){
                this.state[this.playerPos.i + a][this.playerPos.j + b] = Board.PLAYER_AT_EMPTY_SPACE;
            } else {
                this.state[this.playerPos.i + a][this.playerPos.j + b] = Board.PLAYER_AT_VALID_SPACE;
            }

            this.playerPos.i += a;
            this.playerPos.j += b;
            
            return true;
        }
        
        if (nextInDir == Board.WALL){
            return ;
        }
        
        if (nextInDir == Board.BOX_AT_EMPTY_SPACE || nextInDir == Board.BOX_AT_VALID_SPACE){

            let n2nInDir = this.state[this.playerPos.i + (2 * a)][this.playerPos.j + (2 * b)];
            if (n2nInDir == Board.EMPTY_SPACE || n2nInDir == Board.VALID_SPACE){
                if (n2nInDir == Board.EMPTY_SPACE){
                    this.state[this.playerPos.i + (2 * a)][this.playerPos.j + (2 * b)] = Board.BOX_AT_EMPTY_SPACE;
                } else {
                    this.state[this.playerPos.i + (2 * a)][this.playerPos.j + (2 * b)] = Board.BOX_AT_VALID_SPACE;
                }

                if (nextInDir == Board.BOX_AT_EMPTY_SPACE){
                    this.state[this.playerPos.i + a][this.playerPos.j + b] = Board.PLAYER_AT_EMPTY_SPACE;
                } else {
                    this.state[this.playerPos.i + a][this.playerPos.j + b] = Board.PLAYER_AT_VALID_SPACE;
                }

                if (cur == Board.PLAYER_AT_EMPTY_SPACE){
                    this.state[this.playerPos.i][this.playerPos.j] = Board.EMPTY_SPACE;
                } else {
                    this.state[this.playerPos.i][this.playerPos.j] = Board.VALID_SPACE;
                }

                this.playerPos.i += a;
                this.playerPos.j += b;

                return true;
            }

            return ;
        }
    }

    isFinalState(){
        for (let i of this.state){
            for (let j of i){
                if (j == Board.VALID_SPACE || j == Board.PLAYER_AT_VALID_SPACE) return false;
            }
        }

        return true;
    }
}

module.exports = Board