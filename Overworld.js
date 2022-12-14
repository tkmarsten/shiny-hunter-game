class Overworld {
  constructor(config) {
    this.element = config.element
    this.canvas = this.element.querySelector('.game-canvas')
    this.ctx = this.canvas.getContext("2d")
    this.map = null
  }

  startGameLoop() {
    const tick = () => {

      const cameraPerson = this.map.gameObjects.player

      Object.values(this.map.gameObjects).forEach(object => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map
        })
      })

      this.map.drawImage(this.ctx, cameraPerson)

      Object.values(this.map.gameObjects).forEach(object => {
        object.sprite.draw(this.ctx, cameraPerson)
      })

      requestAnimationFrame(() => {
        tick()
      })
    }

    tick()
  }

  init() {
    this.map = new OverworldMap(window.OverworldMaps.Center)
    this.map.mountObjects()

    this.directionInput = new DirectionInput()
    this.directionInput.init()

    this.startGameLoop()
  }
}