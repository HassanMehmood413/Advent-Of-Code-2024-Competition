const fs = require('fs');

// Read input from input.txt
const inputFile = 'input.txt';
const outputFile = 'output.txt';

try {
    const input = fs.readFileSync(inputFile, 'utf-8');
    
    // Parse input into two arrays
    let lines = input.trim().split('\n');
    let a = [];
    let b = [];
    for (let line of lines) {
        let [x, y] = line.trim().split(/\s+/).map(Number);
        a.push(x);
        b.push(y);
    }

    // Sort the arrays
    a = a.sort((x, y) => x - y);
    b = b.sort((x, y) => x - y);

    // Calculate the absolute differences and sum them
    let res = [];
    for (let i = 0; i < a.length; i++) {
        let d = Math.abs(a[i] - b[i]);
        res.push(d);
    }
    let sum = res.reduce((acc, cur) => acc + cur, 0);

    // Write the results to output.txt
    const result = `Sorted A: ${a.join(', ')}\nSorted B: ${b.join(', ')}\nAbsolute Differences: ${res.join(', ')}\nSum of Differences: ${sum}\n`;
    fs.writeFileSync(outputFile, result);

    console.log('Processing complete. Results saved to output.txt');
} catch (err) {
    console.error(`Error reading or writing files: ${err.message}`);
}
