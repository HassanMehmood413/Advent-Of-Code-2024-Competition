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
    let map = new Map()
    b.forEach((value) => {
        if (map.has(value)) {
            map.set(value, map.get(value) + 1)
        }
        else {
            map.set(value, 1)
        }
    })
    console.log(map)

    // Calculate the absolute differences and sum them
    let res = []
    for (let i = 0; i < a.length; i++) {
        let c = map.get(a[i])
        if (c == undefined) {
            c = 0
        }
        res.push(c * a[i])
    }
    let sum = res.reduce((acc, dcc) => acc + dcc, 0)

    // Write the results to output.txt
    const result = `Sum of Differences: ${sum}\n`;
    fs.writeFileSync(outputFile, result);

    console.log('Processing complete. Results saved to output.txt');
} catch (err) {
    console.error(`Error reading or writing files: ${err.message}`);
}


// const a = [3, 4, 2, 1, 3, 3];
// const b = [4, 3, 5, 3, 9, 3];

// let map = new Map()
// b.forEach((value) => {
//     if (map.has(value)) {
//         map.set(value, map.get(value) + 1)
//     }
//     else {
//         map.set(value, 1)
//     }
// })
// console.log(map)

// let res = []
// for (let i = 0; i < a.length; i++) {
//     let c = map.get(a[i])
//     if (c == undefined) {
//         c = 0
//     }
//     res.push(c * a[i])
// }
// let sum = res.reduce((acc, dcc) => acc + dcc, 0)
// console.log(sum)