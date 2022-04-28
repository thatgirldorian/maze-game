//allow Matter js objects to work in our app by destructuring
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter

//create configuration variables for maze values
const cellsHorizontal = 10
const cellsVertical = 8

const width = window.innerWidth
const height = window.innerHeight

const unitLengthX = width / cellsHorizontal
const unitLengthY = width / cellsVertical

//create the properties
const engine = Engine.create()
//disable ball gravity
engine.world.gravity.y = 0

const { world } = engine
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width: width,
        height: height,
        background: 'white'
    }
})

//render and draw the content we have on the screen
Render.run(render)
Runner.run(Runner.create(), engine)

//create walls of our maze so the shapes do not fall off
const walls = [
    Bodies.rectangle(width/2, 0, width, 2, { isStatic: true }),
    Bodies.rectangle(width/2, height, width, 2, { isStatic: true }),
    Bodies.rectangle(0, height/2, 2, height, { isStatic: true }),
    Bodies.rectangle(width, height/2, 2, height, { isStatic: true })
]

World.add(world, walls)

//randomly shuffle grid elements (arrays)
const shuffle = (arr) => {
    let counter = arr.length

    while (counter > 0) {
        const index = Math.floor(Math.random() * counter)

        counter--

       //swap elements
        const temp = arr[counter]
        arr[counter] = arr[index]
        arr[index] = temp
    }

    return arr
}

//Use map array method to generate our maze grids (rows first)
const grid = Array(cellsVertical)
    .fill(null)
    //add a value for each column
    .map(() => Array(cellsHorizontal).fill(false))

//Generate maze verticals and horizontals
const verticals = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal - 1).fill(false))

    const horizontals = Array(cellsVertical - 1)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false))

    // console.log(horizontals)

    //Create the maze pattern by first picking a random starting cells
    const startRow = Math.floor(Math.random() * cellsVertical)
    const startColumn = Math.floor(Math.random() * cellsHorizontal)

    // Create a function that iterates over our maze
    const iterateOverCell = (row, column) => {
        //if I have visited a cell at [row, column] then return
        if (grid[row][column]) {
            return
        }
        //mark this cell as visited and change value to true
        grid[row][column] = true

        //assemble randomly-ordered list of neighbors
        const neighbors = shuffle([
            [row - 1, column, 'up'],
            [row,  column + 1, 'right'],
            [row + 1, column, 'down'],
            [row, column - 1, 'left']
        ]);
        console.log(neighbors)
        //for each neighbor, see if neighbor is non-existent/out of range
        for (let neighbor of neighbors) {
            const [nextRow, nextColumn, direction] = neighbor

            if (
                nextRow < 0 || 
                nextRow >= cellsVertical || 
                nextColumn < 0 || 
                nextColumn >= cellsHorizontal) {
                continue
            }

            //if we have visited that neighbor, continue to the next neighbor
        if (grid[nextRow][nextColumn]) {
            continue
        }
    
        //remove a wall from the horizontals or verticals array
        if (direction === 'left') {
            verticals[row][column - 1] = true
        } else if (direction === 'right') {
            verticals[row][column] = true
        } else if (direction === 'up') {
            horizontals[row-1][column] = true
        } else if (direction === 'down') {
            horizontals[row][column] = true
        }

        iterateOverCell(nextRow, nextColumn)
    }
}


    iterateOverCell(startRow, startColumn)

    //iterate over arrays
    horizontals.forEach((row, rowIndex) => {
        row.forEach((open, columnIndex) => {
            if (open) {
                return
            }

            const wall = Bodies.rectangle(
                columnIndex * unitLengthX + unitLengthX / 2, 
                rowIndex * unitLengthY + unitLengthY,
                unitLengthX,
                5,
                {
                    label: 'wall',
                    isStatic: true,
                    render: {
                        fillStyle: '#82A284'
                    }
                }
            )
            //add shape
            World.add(world, wall)
        })  
    })

    verticals.forEach((row, rowIndex) => {
        row.forEach((open, columnIndex) => {
            if (open) {
                return
            }

            const wall = Bodies.rectangle(
                columnIndex * unitLengthX + unitLengthX, 
                rowIndex * unitLengthY + unitLengthY / 2,
                5,
                unitLengthY,
                {
                    label: 'wall',
                    isStatic: true,
                    render: {
                        fillStyle: '#82A284'
                    }
                }
            )
            //add shape
            World.add(world, wall)
        })  
    })

    //create a goal for the Maze
    const goal = Bodies.rectangle(
        width - unitLengthX / 2,
        height - unitLengthY / 2,
        unitLengthX * .7,
        unitLengthY * .7,
        {
            label: "goal",
            isStatic: true,
            render: {
                fillStyle: '#446A46'
            }
        }
    )
    World.add(world, goal)

    //create a ball for playing through the Maze
    ballRadius = Math.min(unitLengthX, unitLengthY) / 4
    const ball = Bodies.circle(
        unitLengthX / 2, 
        unitLengthY / 2, 
        ballRadius, 
        {
            label: "ball",
            render: {
                fillStyle: '#FFC4DD'
            }
        }
    )
    World.add(world, ball)

    //handle keypress and ball direction changes
    document.addEventListener('keydown', event => {

        //get the velocity of the ball
        const { x, y } = ball.velocity
        // console.log(x, y)

        if (event.code === 'KeyW') { 
            Body.setVelocity(ball, { x, y: y - 5})
        }

        if (event.code === 'KeyA') {
            Body.setVelocity(ball, { x: x - 5, y})
        }

        if (event.code === 'KeyD') {
            Body.setVelocity(ball, { x, y: y + 5})
        }

        if (event.code === 'KeyS') {
            Body.setVelocity(ball, { x: x + 5, y})
        }
    })

    //detect when a user wins the game
    Events.on(engine, 'collisionStart', event => {
        event.pairs.forEach( collision => {
            //figure out which shape is which 
            const labels = ['ball', 'goal']

            if (labels.includes(collision.bodyA.label) &&
                labels.includes(collision.bodyB.label)
        ) {
                //add a way to let the user know that they won
            document.querySelector('.winner').classList.remove('hidden')

                world.gravity.y = 1
                world.bodies.forEach(body => {
                    if (body.label === 'wall') { 
                        Body.setStatic(body, false)
                    }
                })
        }
        })
    })

    //refresh game when Refresh button is clicked on
    document.querySelector('#refresh-btn').onclick = () => {
        window.location.reload()
    }