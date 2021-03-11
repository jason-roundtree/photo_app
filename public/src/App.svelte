<script>
	let photoAlbumsData = []

	async function getPhotoAlbumNames() {
		try {
			const res = await fetch('http://localhost:9000/folders')
			// TODO: move this logic checking the response to it's own util function?
			if (res.ok) {
				return res.json()
			} else {
				throw new Error(res)
			}
		} catch(err) {
			console.log('error fetching folders: ', err)
		}
	}

	// TODO: add custom meta context for image from each album that i want to preview?
	// TODO: add custom meta context for album name formatted to be displayed
	// TODO: how to directly query for only the first image from server api?
	async function getPhotoAlbum(folderName) {
		try {
			const res = await fetch(`http://localhost:9000/folder/${folderName}`)
			// TODO: move this logic checking the response to it's own util function?
			if (res.ok) {
				console.log('getPhotoAlbum res: ', res)
				return res.json()
			} else {
				throw new Error(res)
			}
		} catch(err) {
			console.log(`error fetching ${folderName} folder: `, err)
		}
	}

	getPhotoAlbumNames()
		.then(({ folders }) => {
			// console.log('folders: ', folders)
			const fullAlbumPromises = folders.map(({ name }) => {
				return getPhotoAlbum(name)
			})
			// console.log('fullAlbumPromises: ', fullAlbumPromises)
			Promise.all(fullAlbumPromises)
				.then(fullFolderData => {
					fullFolderData.forEach(({ resources }) => {
						if (resources.length) {
							// console.log('folder context: ', resources[0].context)
							// TODO: uncomment once you tag the photos you want to preview from each folder (the first image for one folder is currently private). Also, remove array index from `resources` since you'll be query the images directly
							// if (!resources[0].context.isPrivate) {
									photoAlbumsData = [...photoAlbumsData, {
									previewImgUrl: resources[0].url,
									// TODO: remove folder if you end up not being able to assign metacontext to it
									folder: resources[0],
									imgContext: resources[0].context || null
								}]
							// }
						} 
					})
					console.log('photoAlbumsData: ', photoAlbumsData)
				})
		})
</script>

<main>
	<h1>My Photo Albums</h1>

	<div class='album_previews_grid_container'>
		{#each photoAlbumsData as { previewImgUrl, imgContext }}
			<div class='album_preview_container'>
				<p class='album_name'>{imgContext.display_location}</p>
				<p class='album_date'>{imgContext.date}</p>
				<img 
					src={previewImgUrl} 
					alt={`My photo from Plummer Peak Trail`}
					width='300px'
					height='300px'
				/>
			</div>
		{/each}
	</div>	

</main>

<style>
	main {
		/* text-align: center; */
		padding: 1em;
		/* margin: 0 auto; */
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	.album_previews_grid_container {
		display: grid;
		/* grid-template-columns: 1fr 1fr; */
		gap: 10px 10px;
	}

	.album_preview_container {
		justify-self: center;
		place-self: center;
	}

	.album_name {
		margin: 15px 0 5px;
	}

	.album_date {
		margin-bottom: 5px;
	}

	/* @media (max-width: 1024px) {
		.album_grid_container {
			grid-template-columns: 1fr 1fr 1fr;
		}
	} */

	/* @media (max-width: 769px) {
		.album_previews_grid_container {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 690px) {
		.album_previews_grid_container {
			grid-template-columns: 1fr;
		}
	} */

</style>