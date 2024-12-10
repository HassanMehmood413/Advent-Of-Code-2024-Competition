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

// Gather file information
const files_info = {};
let curr_id = null;
let count = 0;

for (let i = 0; i < layout.length; i++) {
    const ch = layout[i];
    if (ch !== ".") {
        const fid = parseInt(ch, 10);
        if (fid !== curr_id) {
            curr_id = fid;
            count = 1;
            files_info[fid] = [i, 1];
        } else {
            count += 1;
            files_info[fid][1] = count;
        }
    }
}

const max_file_id = Math.max(...Object.keys(files_info).map(Number));

// Function to find a free span
function findFreeSpan(layout, file_start, file_length) {
    if (file_start === 0) return null;

    let best_span_start = null;
    let curr_start = null;
    let curr_count = 0;

    for (let i = 0; i < file_start; i++) {
        if (layout[i] === ".") {
            if (curr_start === null) {
                curr_start = i;
                curr_count = 1;
            } else {
                curr_count += 1;
            }
        } else {
            if (curr_count >= file_length) {
                return curr_start;
            }
            curr_start = null;
            curr_count = 0;
        }
    }

    if (curr_start !== null && curr_count >= file_length) {
        return curr_start;
    }

    return null;
}

// Adjust layout
const sortedKeys = Object.keys(files_info).map(Number).sort((a, b) => b - a);

for (const fid of sortedKeys) {
    const [start_pos, length] = files_info[fid];
    const span_start = findFreeSpan(layout, start_pos, length);

    if (span_start !== null) {
        for (let i = start_pos; i < start_pos + length; i++) {
            layout[i] = ".";
        }
        for (let i = span_start; i < span_start + length; i++) {
            layout[i] = String(fid);
        }
        files_info[fid][0] = span_start;
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
