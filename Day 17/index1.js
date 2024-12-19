const fs = require('fs');

function readProgram(filePath) {
    // Reads the program from the file
    const lines = fs.readFileSync(filePath, 'utf-8').trim().split('\n');
    const registers = {};
    let program = [];

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith("Register A")) {
            registers['A'] = parseInt(line.split(": ")[1], 10);
        } else if (line.startsWith("Register B")) {
            registers['B'] = parseInt(line.split(": ")[1], 10);
        } else if (line.startsWith("Register C")) {
            registers['C'] = parseInt(line.split(": ")[1], 10);
        } else if (line.startsWith("Program")) {
            program = line.split(": ")[1].split(",").map(Number);
        }
    });

    return { registers, program };
}

function getOperandValue(operand, registers) {
    // Calculates the value of a combo operand
    if (operand <= 3) {
        return operand;
    } else if (operand === 4) {
        return registers['A'];
    } else if (operand === 5) {
        return registers['B'];
    } else if (operand === 6) {
        return registers['C'];
    } else {
        throw new Error("Invalid combo operand");
    }
}

function executeProgram(registers, program) {
    // Executes the given program
    let instructionPointer = 0;
    const output = [];

    while (instructionPointer < program.length) {
        const opcode = program[instructionPointer];
        const operand = program[instructionPointer + 1];

        if (opcode === 0) { // adv
            const divisor = 2 ** getOperandValue(operand, registers);
            registers['A'] = Math.floor(registers['A'] / divisor);
        } else if (opcode === 1) { // bxl
            registers['B'] ^= operand;
        } else if (opcode === 2) { // bst
            registers['B'] = getOperandValue(operand, registers) % 8;
        } else if (opcode === 3) { // jnz
            if (registers['A'] !== 0) {
                instructionPointer = operand;
                continue;
            }
        } else if (opcode === 4) { // bxc
            registers['B'] ^= registers['C'];
        } else if (opcode === 5) { // out
            output.push(getOperandValue(operand, registers) % 8);
        } else if (opcode === 6) { // bdv
            const divisor = 2 ** getOperandValue(operand, registers);
            registers['B'] = Math.floor(registers['A'] / divisor);
        } else if (opcode === 7) { // cdv
            const divisor = 2 ** getOperandValue(operand, registers);
            registers['C'] = Math.floor(registers['A'] / divisor);
        } else {
            throw new Error("Invalid opcode");
        }

        instructionPointer += 2;
    }

    return output.join(',');
}

// Main Execution
const filePath = "input.txt";

try {
    const { registers, program } = readProgram(filePath);
    const result = executeProgram(registers, program);
    console.log(result);
} catch (error) {
    console.error("Error:", error.message);
}
