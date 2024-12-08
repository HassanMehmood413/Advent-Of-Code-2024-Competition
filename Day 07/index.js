const fs = require('fs');

// Function to evaluate the equation formed by inserting the operators
function evaluateEquation(numbers, operators) {
    let expression = numbers[0];
    for (let i = 0; i < operators.length; i++) {
        if (operators[i] === '+') {
            expression += numbers[i + 1];
        } else if (operators[i] === '*') {
            expression *= numbers[i + 1];
        }
    }
    return expression;
}

// Function to parse the input file
function parseInput(filePath) {
    const equations = [];
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n');

    lines.forEach(line => {
        if (!line.trim()) return;

        const [testValue, numbersStr] = line.split(':');
        const numbers = numbersStr.trim().split(/\s+/).map(Number);
        equations.push({
            testValue: parseInt(testValue.trim(), 10),
            numbers
        });
    });

    return equations;
}

// Function to determine which equations can be made true by inserting + or * operators
function findSolvableEquations(equations) {
    let totalCalibration = 0;

    equations.forEach(({ testValue, numbers }) => {
        const numPositions = numbers.length - 1;
        let foundSolution = false;

        // Generate all combinations of + and * operators for the given positions
        const generateOperators = (len) => {
            const results = [];
            const helper = (current) => {
                if (current.length === len) {
                    results.push(current);
                    return;
                }
                ['+', '*'].forEach(op => helper([...current, op]));
            };
            helper([]);
            return results;
        };

        const operatorCombinations = generateOperators(numPositions);

        for (const ops of operatorCombinations) {
            if (evaluateEquation(numbers, ops) === testValue) {
                totalCalibration += testValue;
                foundSolution = true;
                break;
            }
        }
    });

    return totalCalibration;
}

// Main function
function main(filePath) {
    const equations = parseInput(filePath);
    const result = findSolvableEquations(equations);
    console.log(`Total Calibration Result: ${result}`);
}

// Execute main function
const filePath = 'input.txt';
main(filePath);
