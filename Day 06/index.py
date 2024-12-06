def parse_map(file_path):
    """Parse the input map to extract the grid and initial guard position."""
    with open(file_path, 'r') as file:
        lines = file.read().strip().splitlines()

    grid = [list(line) for line in lines]
    guard_position = None
    guard_direction = None

    # Directions represented as (dy, dx): up, right, down, left
    directions = {
        '^': (-1, 0),
        '>': (0, 1),
        'v': (1, 0),
        '<': (0, -1)
    }

    # Find the initial guard position and direction
    for y, row in enumerate(grid):
        for x, cell in enumerate(row):
            if cell in directions:
                guard_position = (y, x)
                guard_direction = directions[cell]
                grid[y][x] = '.'  # Replace the guard's symbol with empty space
                break
        if guard_position:
            break

    return grid, guard_position, guard_direction

def turn_right(direction):
    """Turn the direction 90 degrees to the right."""
    # Directions represented as (dy, dx): up, right, down, left
    directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]  # Up, Right, Down, Left
    current_index = directions.index(direction)
    return directions[(current_index + 1) % 4]

def simulate_guard(grid, start_position, start_direction):
    """Simulate the guard's patrol and count distinct positions visited."""
    rows, cols = len(grid), len(grid[0])
    visited_positions = set()

    # Starting position
    y, x = start_position
    direction = start_direction
    visited_positions.add((y, x))

    while True:
        # Calculate the next position
        dy, dx = direction
        ny, nx = y + dy, x + dx

        # Check if the next position is within bounds
        if 0 <= ny < rows and 0 <= nx < cols:
            if grid[ny][nx] == '#':
                # Obstacle ahead, turn right
                direction = turn_right(direction)
            else:
                # Move forward
                y, x = ny, nx
                visited_positions.add((y, x))
        else:
            # Out of bounds, stop the simulation
            break

    return len(visited_positions)

# Main logic
file_path = 'input.txt'
grid, guard_position, guard_direction = parse_map(file_path)
result = simulate_guard(grid, guard_position, guard_direction)
print("Number of distinct positions visited:", result)
