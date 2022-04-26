//allow Matter js objects to work in our app by destructuring
const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter

const width = 800
const height = 600

//create the properties
const engine = Engine.create()
const { world } = engine
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width: width,
        height: height
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

//Add some shapes and make them show up randomly
for ( let i = 0; i < 50; i++) {
    if (Math.random() > 0.5) {
        World.add(
            world, Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50))
    } else {
        World.add(
            world, Bodies.circle(Math.random() * width, Math.random() * height, 35, {
                render: {
                    fillStyle: "pink"
                }
            })
        )}
}