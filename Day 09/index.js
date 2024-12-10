const fs = require('fs');
const path = require('path');

// const fn = "ex1.txt";
const fn = "input.txt";
// const fn = path.join(__dirname, fn);
const dat = fs.readFileSync(fn, 'utf8').trim().split('\n');

const s = dat[0];
const layout = [];
let file_id = 0;

// Build the initial layout
for (let i = 0; i < s.length; i++) {
    const length = parseInt(s[i], 10);
    if (i % 2 === 0) {
        // file blocks
        for (let j = 0; j < length; j++) {
            layout.push(String(file_id));
        }
        file_id += 1;
    } else {
        // gaps
        for (let j = 0; j < length; j++) {
            layout.push(".");
        }
    }
}

// Fill gaps as per the logic
while (true) {
    const gap_index = layout.indexOf(".");
    if (gap_index === -1) break;

    const found_file_to_the_right = layout.slice(gap_index + 1).some(ch => ch !== ".");
    if (!found_file_to_the_right) break;

    for (let i = layout.length - 1; i >= 0; i--) {
        if (layout[i] !== ".") {
            layout[gap_index] = layout[i];
            layout[i] = ".";
            break;
        }
    }
}

// Calculate the checksum
let checksum = 0;
for (let i = 0; i < layout.length; i++) {
    const ch = layout[i];
    if (ch !== ".") {
        checksum += i * parseInt(ch, 10);
    }
}

console.log(checksum);
