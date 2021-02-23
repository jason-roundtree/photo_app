<script>
	let photoAlbumsData = []

	async function getPhotoAlbumNames() {
		try {
			const res = await fetch('http://localhost:9000/folders')
			if (res.ok) {
				return res.json()
			} else {
				throw new Error(data)
			}
		} catch(err) {
			console.log('error fetching folders: ', err)
		}
	}

	async function getFirstPhotoFromEachAlbum(folderName) {
		try {
			const res = await fetch(`http://localhost:9000/folder/${folderName}`)
			if (res.ok) {
				return res.json()
			} else {
				throw new Error(data)
			}
		} catch(err) {
			console.log(`error fetching ${folderName} folder: `, err)
		}
	}

	getPhotoAlbumNames()
		.then(({ folders }) => {
			console.log('folders: ', folders)
			const fullFolderPromises = folders.map(({ name }) => {
				return getFirstPhotoFromEachAlbum(name)
			})
			console.log('fullFolderPromises: ', fullFolderPromises)
			Promise.all(fullFolderPromises)
				.then(fullFolderData => {
					console.log('fullFolderData: ', fullFolderData)
					fullFolderData.forEach(data => {
						photoAlbumsData = [...photoAlbumsData, {
							previewImgSrc: data.resources[0].url,
							folder: data.resources[0].folder.split('/')[1],
						}]
					})
					console.log('photoAlbumsData: ', photoAlbumsData)
				})
		})
</script>

<main>
	<h1>My Photo Albums</h1>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	/* @media (min-width: 640px) {
		main {
			max-width: none;
		}
	} */
</style>