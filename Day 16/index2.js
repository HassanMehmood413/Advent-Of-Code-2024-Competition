class MazeSolver {
    constructor(maze) {
        this.maze = maze;
        this.height = maze.length;
        this.width = maze[0].length;
        const { start, end } = this._findStartEnd();
        this.start = start;
        this.end = end;
    }

    _findStartEnd() {
        let start = null;
        let end = null;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.maze[y][x] === 'S') {
                    start = [y, x];
                } else if (this.maze[y][x] === 'E') {
                    end = [y, x];
                }
            }
        }

        return { start, end };
    }

    findOptimalTiles() {
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        const bestScores = new Map();
        const queue = [[...this.start, 0, 0]]; // y, x, dir, score
        let minEndScore = Infinity;

        // First pass: Find minimum score to the end
        while (queue.length > 0) {
            const [y, x, dir, score] = queue.shift();

            if (score >= minEndScore) continue;

            const state = `${y},${x},${dir}`;
            if (bestScores.has(state) && bestScores.get(state) <= score) continue;

            bestScores.set(state, score);

            if (y === this.end[0] && x === this.end[1]) {
                minEndScore = Math.min(minEndScore, score);
                continue;
            }

            // Move forward
            const [dy, dx] = directions[dir];
            const ny = y + dy, nx = x + dx;
            if (ny >= 0 && ny < this.height && nx >= 0 && nx < this.width && this.maze[ny][nx] !== '#') {
                queue.push([ny, nx, dir, score + 1]);
            }

            // Turn left or right
            queue.push([y, x, (dir - 1 + 4) % 4, score + 1000]);
            queue.push([y, x, (dir + 1) % 4, score + 1000]);
        }

        // Second pass: Find tiles in optimal paths
        const optimalTiles = new Set();
        const queue2 = [[...this.start, 0, 0, new Set([`${this.start[0]},${this.start[1]}`])]];

        while (queue2.length > 0) {
            const [y, x, dir, score, path] = queue2.shift();

            if (score > minEndScore) continue;

            const state = `${y},${x},${dir}`;
            if (score > (bestScores.get(state) || Infinity)) continue;

            if (y === this.end[0] && x === this.end[1] && score === minEndScore) {
                for (const p of path) optimalTiles.add(p);
                continue;
            }

            // Move forward
            const [dy, dx] = directions[dir];
            const ny = y + dy, nx = x + dx;
            if (ny >= 0 && ny < this.height && nx >= 0 && nx < this.width && this.maze[ny][nx] !== '#') {
                const newPath = new Set(path);
                newPath.add(`${ny},${nx}`);
                queue2.push([ny, nx, dir, score + 1, newPath]);
            }

            // Turn left or right
            queue2.push([y, x, (dir - 1 + 4) % 4, score + 1000, new Set(path)]);
            queue2.push([y, x, (dir + 1) % 4, score + 1000, new Set(path)]);
        }

        return optimalTiles.size;
    }
}

// Visualization function
function visualizePath(maze, optimalTiles) {
    for (let y = 0; y < maze.length; y++) {
        let line = "";
        for (let x = 0; x < maze[0].length; x++) {
            if (optimalTiles.has(`${y},${x}`)) {
                line += maze[y][x] === 'S' || maze[y][x] === 'E' ? maze[y][x] : 'O';
            } else {
                line += maze[y][x];
            }
        }
        console.log(line);
    }
}

// Main function
function main() {
    const sampleMaze = `
##########
#S...#...#
#.##.#.#.#
#.#..#.#E#
##########
    `.trim();

    const maze = sampleMaze.split("\n").map(line => line.split(""));
    const solver = new MazeSolver(maze);
    const result = solver.findOptimalTiles();
    console.log(`Number of tiles in optimal paths: ${result}`);
    visualizePath(maze, solver.findOptimalTiles());
}

main();
