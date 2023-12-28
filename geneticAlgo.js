const Board = require('./board.js');
const levels = require('./levels.js');
const Search = require('./search.js');
const fs = require('fs');

let initWeights = [
    [6, 9, 5],
    [10, 10, 10],
    [0, 0, 0],
    [3, 6, 1],
    [8, 3, 5],
    [9, 2, 6],
    [4, 1, 7],
    [3, 6, 8],
    [5, 2, 1],
    [3, 5, 4]
];

function evaluate(weight){
    let cost = 0;
    for (let [levelName, level] of Object.entries(levels)){
        let moves = Search.search(new Board(level), [], new Set(), ...weight, false);
        cost += moves.length;
    }

    cost = cost / Object.keys(levels).length;
    return cost;
}

function geneticRound(weights){
    // selection phase
    console.log("selection phase started");
    for (let i = 0; i < weights.length; i++){
        let w = weights[i];
        let cost = evaluate(w);
        weights.splice(i, 1, [w, cost]);
    }

    weights.sort((a, b) => a[1] - b[1]);
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
        let r = Math.random();
        if (r <= probability){
            let randomIndex = Math.floor(Math.random() * ((offspring.length - 1) + 1));
            let randomValue = Math.floor(Math.random() * (10 + 1));
            offspring[randomIndex] = randomValue;
        }

        return offspring;
    }

    console.log('recombination phase started');
    let newGen = [];
    for (let i = 0; i < weights.length; i++){
        let offspring1 = makeOffspring(weights[i][0], weights[(i + 1) % weights.length][0], 0.3);
        let offspring2 = makeOffspring(weights[i][0], weights[(i + 2) % weights.length][0], 0.3);
        newGen.push(offspring1);
        newGen.push(offspring2);
    }
    console.log('recombination phase finished');

    return newGen;
}

let prevWeights = initWeights;
fs.appendFile('trainedWeights.txt', "yo", err => {
    console.log(err);
});

for (let i = 0; i < 100; i++){
    fs.appendFile('trainedWeights.txt', `Round ${i}:\n\n`, err => {
        console.log(err);
    });

    let weights = geneticRound(prevWeights);
    prevWeights = weights;

    console.log(weights);

    fs.appendFile('trainedWeights.txt', JSON.stringify(weights), err => {
        console.log(err);
    });

    fs.appendFile('trainedWeights.txt', '\n\n', err => {
        console.log(err);
    });
}