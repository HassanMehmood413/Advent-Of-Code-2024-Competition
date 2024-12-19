function run(prog, a, b, c) {
    // Function to handle the combo logic
    function combo(num) {
        if (num <= 3) {
            return num;
        } else if (num === 4) {
            return a;
        } else if (num === 5) {
            return b;
        } else if (num === 6) {
            return c;
        }
    }

    const output = [];
    let ip = 0;

    while (ip < prog.length) {
        const instr = prog[ip];
        const operand = prog[ip + 1];

        switch (instr) {
            case 0: // Divide A by 2^combo(operand)
                a = Math.floor(a / Math.pow(2, combo(operand)));
                break;

            case 1: // XOR B with operand
                b ^= operand;
                break;

            case 2: // Set B to combo(operand) % 8
                b = combo(operand) % 8;
                break;

            case 3: // Jump to operand if A is not zero
                if (a !== 0) {
                    ip = operand - 2;
                }
                break;

            case 4: // XOR B with C
                b ^= c;
                break;

            case 5: // Append combo(operand) % 8 to output
                output.push(combo(operand) % 8);
                break;

            case 6: // Set B to A / 2^combo(operand)
                b = Math.floor(a / Math.pow(2, combo(operand)));
                break;

            case 7: // Set C to A / 2^combo(operand)
                c = Math.floor(a / Math.pow(2, combo(operand)));
                break;

            default:
                throw new Error("Invalid instruction");
        }

        ip += 2;
    }

    return output;
}

// Recursive function to find a solution
function rec(n, a, prog) {
    if (n === -1) {
        return a;
    }

    a <<= 3;
    for (let x = 0; x < 8; x++) {
        if (JSON.stringify(run(prog, a + x, 0, 0)) === JSON.stringify(prog.slice(n))) {
            const result = rec(n - 1, a + x, prog);
            if (result !== -1) {
                return result;
            }
        }
    }

    return -1;
}

// Input values
const a = 63687530; // Register A
const b = 0;        // Register B
const c = 0;        // Register C
const prog = [2, 4, 1, 3, 7, 5, 0, 3, 1, 5, 4, 1, 5, 5, 3, 0]; // Program sequence

// Run the program and print the output
console.log("Output:", run(prog, a, b, c).join(","));

// Print the result of the recursive function
console.log("Result:", rec(prog.length - 1, 0, prog));
