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

      Object.values(this.map.gameObjects).sort((a, b) => {
        return a.y - b.y
      }).forEach(object => {
        object.sprite.draw(this.ctx, cameraPerson)
      })

      requestAnimationFrame(() => {
        tick()
      })
    }

    tick()
  }

  bindActionInput() {
    new KeyPressListener('Enter', () => {
      this.map.checkForActionCutscene()
    })
  }

  bindPlayerPositionCheck() {
    document.addEventListener('PersonWalkingComplete', e => {
      if (e.detail.whoId === 'player') {
        this.map.checkForFootstepCutscene()
      }
    })
  }

  startMap(mapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();
  }

  init() {
    this.startMap(window.OverworldMaps.Center);

    this.bindActionInput()
    this.bindPlayerPositionCheck()

    this.directionInput = new DirectionInput()
    this.directionInput.init()

    this.startGameLoop()

    this.map.startCutscene([
      { who: 'player', type: 'walk', direction: 'up' },
      { who: 'player', type: 'walk', direction: 'up' },
      { who: 'player', type: 'walk', direction: 'up' },
      { type: 'textMessage', text: 'Welcome trainer. Uhm... who are you again?' },
      { type: 'textMessage', text: 'Oh! That\'s right, you\'re filling out my shiny dex.' },
      { type: 'textMessage', text: 'Please log in to the system so we can check your progress.' },
    ])
  }
}