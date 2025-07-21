    let cols
    let rows
    let w = 10
    let grid = []
    let curent
    let stack = []
    let canvas
    let x = 0
    let y = 0
    let indexP = 0
    let m

    function setup()
    {
    canvas = createCanvas(200, 200)
    cols = floor(width/w)
    rows = floor(height/w)
    for (let j = 0; j < rows; j++)
    {
        for (let i = 0; i < cols; i++)
        {
        let cell = new Cell(i, j)
        grid.push(cell)
        }
    }
    current = grid[0]
    m = width/w
    }

    function draw()
    {
    background(255)
    for (let i = 0; i < grid.length; i++)
    {
        grid[i].show()
    }
    current.visited = true
    current.highlight()
    let next = current.checkNeighbours()
    if (next)
    {
        next.visited = true
        stack.push(current)
        removeWalls(current, next)
        current = next
    }
    else if (stack.length > 0)
    {
        current = stack.pop()
    }
    moved()
    fill(0, 128, 128)
    circle(x + w/2, y+ w/2, w/2)
    fill(150, 0, 0)
    circle(width-w/2, height-w/2, w/2)
    
    }

    function index(i, j)
    {
    if (i < 0 || j < 0 || i > cols-1 || j > rows -1)
    {
        return -1
    }
    return i + j * cols
    }

    function removeWalls(a, b)
    {
    let x = a.i - b.i
    if (x == 1)
    {
        a.walls[3] = false
        b.walls[1] = false
    }
    else if (x == -1)
    {
        a.walls[1] = false
        b.walls[3] = false
    }
    let y = a.j - b.j
    if (y == 1)
    {
        a.walls[0] = false
        b.walls[2] = false
    }
    else if (y == -1)
    {
        a.walls[2] = false
        b.walls[0] = false
    }
    }

    // function mouseClicked()
    // {
    //   saveCanvas(canvas, 'maze', 'png')
    // }

    function moved()
    {
    if (keyIsPressed)
    {
    frameRate(10)
    if (keyCode == RIGHT_ARROW)
    {
        if (grid[indexP].walls[1] == false)
        {
        indexP = indexP + 1
        x = x + w
        }
    }
    if (keyCode == LEFT_ARROW)
    {
        if (grid[indexP].walls[3] == false)
        {
        indexP = indexP - 1
        x = x - w
        }
    }
    if (keyCode == UP_ARROW)
    {
        if (grid[indexP].walls[0] == false)
        {
        indexP = indexP - m
        y = y - w
        }
    }
    if (keyCode == DOWN_ARROW)
    {
        if (grid[indexP].walls[2] == false)
        {
        indexP = indexP + m
        y = y + w
        }
    }
    }
    }