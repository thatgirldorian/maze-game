//allow Matter js objects to work in our app by destructuring
const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter

//create the properties
const engine = Engine.create()
const { world } = engine
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 600
    }
})

//render and draw the content we have on the screen
Render.run(render)
Runner.run(Runner.create(), engine)

//add click and drag functionality
World.add(world, MouseConstraint.create(engine, { 
    mouse: Mouse.create(render.canvas)
}))

//create walls so the shapes do not fall off
const walls = [
    Bodies.rectangle(400, 0, 800, 40, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 40, { isStatic: true }),
    Bodies.rectangle(0, 300, 40, 600, { isStatic: true }),
    Bodies.rectangle(800, 300, 40, 600, { isStatic: true })
]

World.add(world, walls)

World.add(world, Bodies.rectangle(200, 200, 50, 50))
