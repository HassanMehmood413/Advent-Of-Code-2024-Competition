const fs = require('fs');

// Part a: Solving the puzzle
function a(data) {
    const [grid, moves] = data.split("\n\n");
    let wall = new Set();
    let boxes = new Set();
    let pos = null;

    const lines = grid.split('\n');
    let height = lines.length;

    // Convert grid into a set of positions
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (let j = 0; j < line.length; j++) {
            const c = line[j];
            if (c === "#") {
                wall.add(`${j},${i}`);
            } else if (c === "O") {
                boxes.add(`${j},${i}`);
            } else if (c === "@") {
                pos = `${j},${i}`;
            }
        }
    }

    const move2dir = {
        '>': [1, 0],    // right
        '^': [0, -1],   // up
        '<': [-1, 0],   // left
        'v': [0, 1],    // down
    };

    for (const move of moves.replace("\n", "")) {
        const [dx, dy] = move2dir[move];
        const [x, y] = pos.split(',').map(Number);

        // Check if next position is a wall
        if (wall.has(`${x + dx},${y + dy}`)) {
            continue;
        }

        // If next position is not a box, just move
        if (!boxes.has(`${x + dx},${y + dy}`)) {
            pos = `${x + dx},${y + dy}`;
            continue;
        }

        // If next position is a box, we need to check if we can push it
        let boxesToMove = 0;
        let posToCheck = [x + dx, y + dy];
        while (true) {
            const boxPos = `${posToCheck[0]},${posToCheck[1]}`;
            if (boxes.has(boxPos)) {
                boxesToMove++;
                posToCheck = [posToCheck[0] + dx, posToCheck[1] + dy];
            } else if (wall.has(boxPos)) {
                boxesToMove = 0;
                break;
            } else {
                break;
            }
        }

        if (boxesToMove > 0) {
            pos = `${x + dx},${y + dy}`;
            boxes.delete(`${x + dx},${y + dy}`);
            boxes.add(`${x + dx + dx * boxesToMove},${y + dy + dy * boxesToMove}`);
        }
    }

    let s = 0;
    for (const box of boxes) {
        const [bx, by] = box.split(',').map(Number);
        s += bx + 100 * by;
    }

    return s;
}

// Part b: Placeholder for part b logic
function b(data) {
    console.log("Part B is not implemented yet.");
    return 0;
}

// Read input from file
function readInput(filePath) {
    return fs.readFileSync(filePath, 'utf-8');
}

// Main execution function
function main() {
    const input_data = readInput('input.txt');

    // Solve part a
    const answer_a = a(input_data);
    console.log("Part A:", answer_a);

    // Solve part b
    const answer_b = b(input_data);
    console.log("Part B:", answer_b);
}

main();
