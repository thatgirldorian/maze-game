//allow Matter js objects to work in our app by destructuring
const { Engine, Render, Runner, World, Bodies } = Matter

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

//create the specific shapes we need 
const shape = Bodies.rectangle(200, 200, 50, 50, {
    isStatic: true
})

World.add(world, shape)