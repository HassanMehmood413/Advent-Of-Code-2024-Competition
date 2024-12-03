const fs = require('fs');

function sumEnabledMultiplications(filePath) {
    // Read the input file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return;
        }

        const validMulPattern = /mul\(\d{1,3},\d{1,3}\)/g;
        const doPattern = /do\(\)/g;
        const dontPattern = /don't\(\)/g;

        let tokens = data.split(/(do\(\)|don't\(\)|mul\(\d{1,3},\d{1,3}\))/);

        let mulEnabled = true; 
        let totalSum = 0;

        tokens.forEach(token => {
            token = token.trim(); // Clean up each token
            
            if (token === "do()") {
                mulEnabled = true;
            } else if (token === "don't()") {
                mulEnabled = false;
            } else if (validMulPattern.test(token) && mulEnabled) {
                let numbers = token.match(/\d+/g).map(Number);
                totalSum += numbers[0] * numbers[1];
            }
        });

        console.log("Total sum:", totalSum);
    });
}


const filePath = "input2.txt"; 
sumEnabledMultiplications(filePath);
