const fs = require('fs');

// Read input from file
function readInput(filePath) {
    return fs.readFileSync(filePath, 'utf-8').trim().split('\n');
}

// Perform logic gate operations
function applyGate(gate, a, b) {
    if (gate === 'AND') {
        return a & b;
    } else if (gate === 'OR') {
        return a | b;
    } else if (gate === 'XOR') {
        return a ^ b;
    }
    return null;
}

// Simulate the circuit
function simulateCircuit(lines) {
    const wireValues = {};
    const gateOperations = [];

    // Parse input
    lines.forEach(line => {
        if (line.includes(':')) {
            const [wire, value] = line.split(': ');
            wireValues[wire] = parseInt(value, 10);
        } else {
            gateOperations.push(line);
        }
    });

    // Process gates until all outputs are computed
    while (gateOperations.length > 0) {
        const remainingOperations = [];
        gateOperations.forEach(operation => {
            const match = operation.match(/(.+) (AND|OR|XOR) (.+) -> (.+)/);
            if (match) {
                const [_, a, gate, b, output] = match;
                if (wireValues.hasOwnProperty(a) && wireValues.hasOwnProperty(b)) {
                    wireValues[output] = applyGate(gate, wireValues[a], wireValues[b]);
                } else {
                    remainingOperations.push(operation);
                }
            }
        });
        gateOperations.length = 0;
        gateOperations.push(...remainingOperations);
    }

    // Collect and sort output wires starting with 'z'
    const outputBits = Object.entries(wireValues)
        .filter(([wire]) => wire.startsWith('z'))
        .sort(([wireA], [wireB]) => wireA.localeCompare(wireB));

    // Construct binary output
    const binaryResult = outputBits
        .map(([_, value]) => value)
        .reverse()
        .join('');

    return parseInt(binaryResult, 2);
}

// Main execution
const inputLines = readInput('input.txt');
const result = simulateCircuit(inputLines);
console.log('Output (Decimal):', result);
