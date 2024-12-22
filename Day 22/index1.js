const fs = require('fs');

// Reads the input file and returns a list of initial secret numbers
function readInput(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return data.split('\n').filter(line => line.trim() !== '').map(Number);
}

// Calculates the next secret number in the sequence
function nextSecretNumber(secret) {
    // Step 1: Multiply by 64 and mix
    secret ^= (secret * 64);
    secret %= 16777216;

    // Step 2: Divide by 32, floor, and mix
    secret ^= Math.floor(secret / 32);
    secret %= 16777216;

    // Step 3: Multiply by 2048 and mix
    secret ^= (secret * 2048);
    secret %= 16777216;

    return secret;
}

// Simulates 2000 steps for each initial secret number and returns the 2000th secret
function calculate2000thSecrets(initialSecrets) {
    return initialSecrets.map(secret => {
        for (let i = 0; i < 2000; i++) {
            secret = nextSecretNumber(secret);
        }
        return secret;
    });
}

function main() {
    const filePath = "input.txt";
    const initialSecrets = readInput(filePath);

    // Calculate the 2000th secret number for each buyer
    const finalSecrets = calculate2000thSecrets(initialSecrets);

    // Sum up the 2000th secret numbers
    const result = finalSecrets.reduce((sum, secret) => sum + secret, 0);
    console.log(`The sum of the 2000th secret numbers is: ${result}`);
}

main();
