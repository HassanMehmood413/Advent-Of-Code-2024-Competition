const fs = require('fs');

// Read input from a file
const input = fs.readFileSync('input.txt', 'utf-8');

// Process the input to convert it into a 2D array
const nums = input.split('\n').map(line => line.trim().split(' ').map(Number));

// Initialize the counter for "safe" reports
let safe = 0;

// Iterate over each report
for (let i = 0; i < nums.length; i++) {
    let increasing = 0;
    let decreasing = 0;

    for (let j = 1; j < nums[i].length; j++) {
        if ((nums[i][j] > nums[i][j - 1])) {
            if (nums[i][j] - nums[i][j - 1] <= 3 && nums[i][j] - nums[i][j - 1] >= 1) {
                increasing++;
            }
        } else if (nums[i][j] < nums[i][j - 1]) {
            if (nums[i][j - 1] - nums[i][j] >= 1 && nums[i][j - 1] - nums[i][j] <= 3) {
                decreasing++;
            }
        }
    }

    if (nums[i].length - 1 <= decreasing && increasing <= 1) {
        safe++;
    } else if (nums[i].length - 1 <= increasing && decreasing <= 1) {
        safe++;
    }
}

// Write the result to an output file
fs.writeFileSync('output.txt', safe.toString(), 'utf-8');
