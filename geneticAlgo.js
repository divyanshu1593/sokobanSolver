const { off } = require('process');
const Board = require('./board.js');
const levels = require('./levels.js');
const Search = require('./search.js');
const fs = require('fs');

let initWeights = [
    [60, 90, 50, 70],
    [100, 100, 100, 70],
    [0, 0, 0, 70],
    [30, 60, 10, 50],
    [80, 30, 50, 0],
    [90, 20, 60, 20],
    [40, 10, 70, 40],
    [30, 60, 80, 100],
    [50, 20, 10, 30],
    [30, 50, 40, 60]
];

function evaluate(weight){
    let costArr = [];
    for (let [levelName, level] of Object.entries(levels)){
        let moves = Search.search(new Board(level), [], new Set(), null, ...weight, false);
        costArr.push(moves.length);
    }

    return costArr;
}

let currentBest = [null, (new Array(Object.keys(levels).length)).fill(Infinity)];

function compareCost(costArr1, costArr2){
    let temp = 0;

    for (let i = 0; i < costArr1.length; i++){
        if (costArr1 > costArr2){
            temp++;
        } else if (costArr1 < costArr2){
            temp--;
        }
    }

    if (temp > 0) return 1;
    if (temp == 0) return 0;
    return -1;
}

function geneticRound(weights){
    // selection phase
    console.log("selection phase started");
    for (let i = 0; i < weights.length; i++){
        let w = weights[i];
        let cost = evaluate(w);
        if (compareCost(currentBest[1], cost) == 1) currentBest = [w, cost];
        weights.splice(i, 1, [w, cost]);
    }

    weights.sort((a, b) => compareCost(a[1], b[1]));
    weights = weights.slice(0, 5);
    console.log('selection phase finished');

    // recombination phase

    function makeOffspring(parent1, parent2, probability){
        let offspring = [];

        for (let i = 0; i < parent1.length; i++){
            let r = Math.random();

            if (r < 0.5){
                offspring.push(parent1[i]);
            } else {
                offspring.push(parent2[i]);
            }
        }

        // random mutation with some probability
        function mutate(offspring, probability){
            let r = Math.random();
            if (r <= probability){
                let randomIndex = Math.floor(Math.random() * ((offspring.length - 1) + 1));
                let randomValue = Math.floor(Math.random() * (100 + 1));
                offspring[randomIndex] = randomValue;
                mutate(offspring, probability);
            }
            return ;
        }

        mutate(offspring, probability);

        return offspring;
    }

    console.log('recombination phase started');
    let newGen = [];
    for (let i = 0; i < weights.length; i++){
        let offspring1 = makeOffspring(weights[i][0], weights[(i + 1) % weights.length][0], 0.5);
        let offspring2 = makeOffspring(weights[i][0], weights[(i + 2) % weights.length][0], 0.5);
        newGen.push(offspring1);
        newGen.push(offspring2);
    }
    console.log('recombination phase finished');

    console.log(`currentBest: ${currentBest[0]} ${currentBest[1]}`);
    return [newGen, currentBest[0], currentBest[1]];
}

let prevWeights = initWeights;
fs.writeFileSync('trainedWeights.txt', '', err => {
    console.log(err);
});

for (let i = 0; i < 100; i++){
    fs.appendFileSync('trainedWeights.txt', `Round ${i}:\n\n`, err => {
        console.log(err);
    });

    let geneticRoundResult = geneticRound(prevWeights);
    let weights = geneticRoundResult[0];
    prevWeights = weights;

    console.log(weights);

    fs.appendFileSync('trainedWeights.txt', `Weights: ${JSON.stringify(weights)}\n`, err => {
        console.log(err);
    });

    fs.appendFileSync('trainedWeights.txt', `Current Best Weight: ${JSON.stringify(geneticRoundResult[1])}\n`, err => {
        console.log(err);
    });

    fs.appendFileSync('trainedWeights.txt', `Current Best cost: ${JSON.stringify(geneticRoundResult[2])}\n`, err => {
        console.log(err);
    });

    fs.appendFileSync('trainedWeights.txt', '\n\n', err => {
        console.log(err);
    });
}