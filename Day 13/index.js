const fs = require('fs');

// Parse the input file and extract button configurations and prize locations
function parseInput(filePath) {
    const machines = [];
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const sections = fileContent.trim().split('\n\n');
    
    sections.forEach(machine => {
        const lines = machine.split('\n');
        const buttonA = lines[0].split(':')[1].trim().split(',').map(v => parseInt(v.split('+')[1]));
        const buttonB = lines[1].split(':')[1].trim().split(',').map(v => parseInt(v.split('+')[1]));
        const prize = lines[2].split(':')[1].trim().split(',').map(v => parseInt(v.split('=')[1]));
        machines.push([buttonA, buttonB, prize]);
    });

    return machines;
}

// Find the minimum tokens required to win the prize for a single machine
function findMinTokens(buttonA, buttonB, prize, maxPresses = 100) {
    const [xTarget, yTarget] = prize;
    const [aX, aY] = buttonA;
    const [bX, bY] = buttonB;

    let minTokens = Infinity;

    for (let aPresses = 0; aPresses <= maxPresses; aPresses++) {
        for (let bPresses = 0; bPresses <= maxPresses; bPresses++) {
            const totalX = aPresses * aX + bPresses * bX;
            const totalY = aPresses * aY + bPresses * bY;

            if (totalX === xTarget && totalY === yTarget) {
                const tokens = aPresses * 3 + bPresses * 1;
                minTokens = Math.min(minTokens, tokens);
            }
        }
    }

    return minTokens !== Infinity ? minTokens : null;
}

// Solve the problem and return the minimum tokens to win the maximum prizes
function solve(filePath) {
    const machines = parseInput(filePath);
    let totalTokens = 0;
    let prizesWon = 0;

    machines.forEach(([buttonA, buttonB, prize]) => {
        const minTokens = findMinTokens(buttonA, buttonB, prize);
        if (minTokens !== null) {
            totalTokens += minTokens;
            prizesWon += 1;
        }
    });

    return { prizesWon, totalTokens };
}

// Main execution
const inputFile = "input.txt";
const { prizesWon, totalTokens } = solve(inputFile);
console.log(`Maximum prizes won: ${prizesWon}`);
console.log(`Minimum tokens spent: ${totalTokens}`);
