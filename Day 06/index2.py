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
    directions = [(-1, 0), (0, 1), (1, 0), (0, -1)]  # Up, Right, Down, Left
    current_index = directions.index(direction)
    return directions[(current_index + 1) % 4]


def simulate_guard(grid, start_position, start_direction):
    """Simulate the guard's patrol and detect loops."""
    rows, cols = len(grid), len(grid[0])
    visited = set()
    path = set()

    y, x = start_position
    direction = start_direction
    visited.add((y, x, direction))

    while True:
        dy, dx = direction
        ny, nx = y + dy, x + dx

        # Check if next position is within bounds
        if 0 <= ny < rows and 0 <= nx < cols:
            if grid[ny][nx] == '#':
                # Obstacle ahead, turn right
                direction = turn_right(direction)
            else:
                # Move forward
                y, x = ny, nx
                state = (y, x, direction)
                if state in visited:
                    # Loop detected
                    return True
                visited.add(state)
        else:
            # Out of bounds, no loop
            return False


def find_loop_positions(grid, guard_position, guard_direction):
    """Find all positions where adding an obstruction causes a loop."""
    rows, cols = len(grid), len(grid[0])
    loop_positions = set()

    # Test each empty position
    for y in range(rows):
        for x in range(cols):
            if (y, x) != guard_position and grid[y][x] == '.':
                # Temporarily add obstruction
                grid[y][x] = '#'
                if simulate_guard(grid, guard_position, guard_direction):
                    loop_positions.add((y, x))
                # Remove obstruction
                grid[y][x] = '.'

    return loop_positions


# Main logic
file_path = 'input.txt'
grid, guard_position, guard_direction = parse_map(file_path)
loop_positions = find_loop_positions(grid, guard_position, guard_direction)
print("Number of positions that create a loop:", len(loop_positions))
