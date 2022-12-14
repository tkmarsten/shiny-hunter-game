class OverworldMap {
  constructor(config) {
    this.gameObjects = config.gameObjects
    this.walls = config.walls || {}

    this.image = new Image()
    this.image.src = config.src
  }

  drawImage(ctx, cameraPerson) {
    ctx.drawImage(this.image, util.withGrid(7) - cameraPerson.x, util.withGrid(7) - cameraPerson.y)
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = util.nextPosition(currentX, currentY, direction)
    return this.walls[`${x},${y}`] || false
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {
      let object = this.gameObjects[key]
      object.id = key
      object.mount(this)
    })
  }

  addWall(x, y) {
    this.walls[`${x},${y}`] = true
  }

  removeWall(x, y) {
    delete this.walls[`${x},${y}`]
  }

  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY)
    const { x, y } = util.nextPosition(wasX, wasY, direction)
    this.addWall(x, y)
  }
}

window.OverworldMaps = {
  Center: {
    src: '/images/map.png',
    gameObjects: {
      player: new Person({
        isPlayerControlled: true,
        x: util.withGrid(7),
        y: util.withGrid(13),
      }),
      npc1: new Person({
        x: util.withGrid(5),
        y: util.withGrid(5)
      })
    },
    walls: {
      [util.asGridCoord(5, 4)]: true,
      [util.asGridCoord(6, 4)]: true,
      [util.asGridCoord(7, 4)]: true,
      [util.asGridCoord(8, 4)]: true,
      [util.asGridCoord(9, 4)]: true,
      [util.asGridCoord(5, 3)]: true,
      [util.asGridCoord(9, 3)]: true
    }
  }
}