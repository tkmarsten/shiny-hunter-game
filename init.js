const ASSET_MANAGER = new AssetManager()

function loadSprites() {
	let base = "./images/"
	let extension = '.png'
	let sprites = {
		"": ['player', 'professor', 'map']
	}

	for (path in sprites) {
		for (index in sprites[path]) {
			ASSET_MANAGER.queueDownload(base + path + sprites[path][index] + extension);
		}
	}
}

loadSprites()

ASSET_MANAGER.downloadAll(function () {
	const overworld = new Overworld({
		element: document.querySelector('.game-container'),
		assetManager: ASSET_MANAGER
	})

	overworld.init()
})