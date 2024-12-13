const fs = require('fs');

// Read and parse input data
let data = fs.readFileSync('input.txt', 'utf-8').trim().split('\n');

const offset = 10000000000000;
const groups = data.join('\n').split('\n\n');
let total = 0;

// Process each group
groups.forEach(group => {
    const [aStr, bStr, pStr] = group.split('\n');

    const [ax, ay] = aStr.slice(10).split(', ').map(x => parseInt(x.slice(2)));
    const [bx, by] = bStr.slice(10).split(', ').map(x => parseInt(x.slice(2)));
    const [px, py] = pStr.slice(7).split(', ').map(x => parseInt(x.slice(2)));

    // Apply the offset to the prize location
    const adjustedPx = px + offset;
    const adjustedPy = py + offset;

    const denominator = ax * by - ay * bx;
    const numeratorM = adjustedPx * by - adjustedPy * bx;

    // Check if the first equation is solvable
    if (numeratorM % denominator !== 0) {
        return;
    }

    const m = numeratorM / denominator;

    const numeratorN = adjustedPy - ay * m;
    if (numeratorN % by !== 0) {
        return;
    }

    const n = numeratorN / by;

    total += 3 * m + n;
});

// Output the result
console.log(total);
