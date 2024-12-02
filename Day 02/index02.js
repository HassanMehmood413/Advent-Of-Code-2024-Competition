const fs = require("fs");

// Read the input from a text file
const input = fs.readFileSync("input.txt", "utf-8");

// Parse the input into a 2D array
const nums = input.trim().split("\n").map(line => line.split(" ").map(Number));

let safe = 0;

// Function to check if a sequence is safe
const isSafe = (arr) => {
    let increasing = 0, decreasing = 0, isvalid = true;
    for (let j = 1; j < arr.length; j++) {
        if (arr[j] > arr[j - 1]) {
            increasing++;
            if (arr[j] - arr[j - 1] > 3 || arr[j] - arr[j - 1] < 1) {
                isvalid = false;
            }
        } else if (arr[j] < arr[j - 1]) {
            decreasing++;
            if (arr[j - 1] - arr[j] > 3 || arr[j - 1] - arr[j] < 1) {
                isvalid = false;
            }
        }
    }
    return isvalid && (increasing === arr.length - 1 || decreasing === arr.length - 1);
};

nums.forEach((report) => {
    if (isSafe(report)) {
        safe++;
    } else {
        for (let i = 0; i < report.length; i++) {
            const modified = [...report.slice(0, i), ...report.slice(i + 1)];
            if (isSafe(modified)) {
                safe++;
                break;
            }
        }
    }
});

fs.writeFileSync("output.txt", `${safe} reports are actually safe!`);

console.log(`${safe}`);
