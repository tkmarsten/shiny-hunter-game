class Sprite {
  constructor(config) {

    this.image = new Image()
    this.image.src = config.src
    this.image.onload = () => {
      this.isLoaded = true
    }

    this.animations = config.animations || {
      idledown: [[0, 0]],
      idleleft: [[0, 1]],
      idleright: [[0, 2]],
      idleup: [[0, 3]],
      walkdown: [[0, 0], [1, 0], [2, 0], [3, 0]],
      walkleft: [[0, 1], [1, 1], [2, 1], [3, 1]],
      walkright: [[0, 2], [1, 2], [2, 2], [3, 2]],
      walkup: [[0, 3], [1, 3], [2, 3], [3, 3]],
    }

    this.currentAnimation = "idleDown" //config.currentAnimation || "idleDown"
    this.currentAnimationFrame = 0

    this.animationFrameLimit = config.animationFrameLimit || 10
    this.animationFrameProgress = this.animationFrameLimit

    this.gameObject = config.gameObject
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame]
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key
      this.currentAnimationFrame = 0
      this.animationFrameProgress = this.animationFrameLimit
    }
  }

  updateAnimationProgress() {
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1
      return
    }

    this.animationFrameProgress = this.animationFrameLimit
    this.currentAnimationFrame += 1

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0
    }
  }

  draw(ctx, cameraPerson) {
    const x = this.gameObject.x + util.withGrid(7) - cameraPerson.x
    const y = this.gameObject.y - 8 + util.withGrid(7) - cameraPerson.y

    const [frameX, frameY] = this.frame

    this.isLoaded && ctx.drawImage(this.image, frameX * 32, frameY * 48 + 6, 30, 42, x, y, 30, 42)

    this.updateAnimationProgress()
  }
}