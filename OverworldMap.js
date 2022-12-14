class OverworldMap {
  constructor(config) {
    this.overworld = null
    this.gameObjects = config.gameObjects
    this.cutsceneSpaces = config.cutsceneSpaces || {}
    this.walls = config.walls || {}

    this.image = new Image()
    this.image.src = config.src

    this.isCutscenePlaying = false
  }

  drawImage(ctx, cameraPerson) {
    ctx.drawImage(this.image, util.withGrid(7) - cameraPerson.x, util.withGrid(7) - cameraPerson.y)
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = util.nextPosition(currentX, currentY, direction);
    return this.walls[`${x},${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach(key => {
      let object = this.gameObjects[key]
      object.id = key
      object.mount(this)
    })
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true

    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this
      })

      await eventHandler.init()
    }

    this.isCutscenePlaying = false

    Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }

  checkForActionCutscene() {
    const player = this.gameObjects['player']
    const nextCoords = util.nextPosition(player.x, player.y, player.direction)
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    })
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events)
    }
  }

  checkForFootstepCutscene() {
    const player = this.gameObjects['player']
    const match = this.cutsceneSpaces[`${player.x},${player.y}`]
    console.log({ match })
    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events)
    }
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
        y: util.withGrid(9),
      }),
      professor: new Person({
        src: '/images/professor.png',
        x: util.withGrid(7),
        y: util.withGrid(7),
        talking: [
          {
            events: [
              { type: 'textMessage', text: 'Welcome trainer.', facePlayer: 'professor' },
              { type: 'textMessage', text: 'Who are you again?' }
            ]
          }
        ]
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
    },
    cutsceneSpaces: {
      [util.asGridCoord(7, 6)]: [
        {
          events: [
            { type: 'textMessage', text: 'What are you doing back there?' }
          ]
        }
      ],
      [util.asGridCoord(7, 13)]: [
        {
          events: [
            { type: 'changeMap', map: 'Outside' }
          ]
        }
      ]
    }
  },
  Outside: {
    src: '/images/map.png',
    gameObjects: {
      player: new Person({
        isPlayerControlled: true,
        x: util.withGrid(7),
        y: util.withGrid(12),
      })
    }
  }
}