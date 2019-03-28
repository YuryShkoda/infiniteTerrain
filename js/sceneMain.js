// 1 
class SceneMain extends Phaser.Scene {
    // 2
    constructor() {
        super({ key: 'SceneMain' })
    }

    // 3
    preload() {
        // 7
        this.load.spritesheet('sprWater', 'assets/sprWater.png', {
            frameWidth: 16,
            frameHeight: 16
        })
        this.load.image('sprSand', 'assets/sprSand.png')
        this.load.image('sprGrass', 'assets/sprGrass.png')
    }

    // 4
    create() {
        // 8
        this.anims.create({
            key: 'sprWater',
            frames: this.anims.generateFrameNumbers('sprWater'),
            frameRate: 5,
            repeat: -1
        })

        // 9 defines the size of chunk by the amount of tiles for both thw width and height of the chunk
        this.chunkSize   = 16 
        this.tileSize    = 16
        this.cameraSpeed = 10

        // 10
        this.cameras.main.setZoom(2)

        // 11 crete a 2-dimensional vector. this 2D vector contains X and Y value for "follow point". The follow point will be used as the point in wich the camera will be centered.
        this.followPoint = new Phaser.Math.Vector2(
            this.cameras.main.worldView.x + (this.cameras.main.worldView.width * 0.5), this.cameras.main.worldView.y + (this.cameras.main.worldView.height * 0.5)
        )

        // 12
        this.chunks = []

        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    }

    // 5
    getChunk(x, y) {
        // 13 retrieve the chunk at a specific (X, Y) position
        let chunk = null

        for (let i = 0; i < this.chunks.length; i++) {
            if (this.chunks[i].x == x && this.chunks[i].y == y) {
                chunk = this.chunks[i]
            }
        }

        return chunk
    }

    // 6
    update() {
        // 14 getting the chunk position the follow point is in. Knowing the chunk position the follow point is in is critical because our chunk creation and chunk loading all happens relative to the chunk thr follow point is in.
        let snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.x / (this.chunkSize * this.tileSize))
        let snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.y / (this.chunkSize * this.tileSize))

        // 15 to get proper chunk position we need to devide by chunkSize and tileSize
        snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize
        snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize

        // 16 create chunks around this chunk if they don't exist yet
        // Create chunks in a radius of two chunks around the follow point
        for (let x = snappedChunkX - 2; x < snappedChunkX + 2; x++) {
            for (let y = snappedChunkY - 2; y < snappedChunkY + 2; y++) {
                let existingChunk = this.getChunk(x, y)

                if (existingChunk == null) {
                    let newChunk = new Chunk(this, x, y)
                    
                    this.chunks.push(newChunk)
                }
            }
        }

        // 17 chunk loading and unloading logic
        for (let i = 0; i < this.chunks.length; i++) {
            let chunk = this.chunks[i]

            if (Phaser.Math.Distance.Between(snappedChunkX, snappedChunkY, chunk.x, chunk.y) < 3) {
                if (chunk !== null) {
                    chunk.load()
                }
            } else {
                if (chunk !== null) chunk.load()
            }
        }

        // 18 add camera movemenent and centering the camera on the follow point
        if (this.keyW.isDown) this.followPoint.y -= this.cameraSpeed
        if (this.keyS.isDown) this.followPoint.y += this.cameraSpeed
        if (this.keyA.isDown) this.followPoint.x -= this.cameraSpeed
        if (this.keyD.isDown) this.followPoint.x += this.cameraSpeed

        // 19 center camera
        this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y)
    }
}