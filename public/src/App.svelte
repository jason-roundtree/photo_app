<script>
	let photoAlbumsPreviewData = []
	let allPhotoAlbumsData = []
	
	async function getPhotoAlbumsFolderInfo() {
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
	async function getPhotoAlbum(folderPath) {
		const category = folderPath.split('/')[0]
		const name = folderPath.split('/')[1]
		try {
			const res = await fetch(`http://localhost:9000/album/${category}/${name}`)
			// TODO: move this logic checking the response to it's own util function?
			if (res.ok) {
				// console.log('getPhotoAlbum res: ', res)
				return res.json()
			} else {
				throw new Error(res)
			}
		} catch(err) {
			console.log(`error fetching ${folderPath} folder: `, err)
		}
	}

	function getPhotoAlbumsData(photoAlbumsFolderInfo) {
		const allAlbumsPromises = photoAlbumsFolderInfo.map(({ path }) => {
			console.log(`path`, path)
			return getPhotoAlbum(path)
		})
		Promise.all(allAlbumsPromises)
			.then(fullFolderData => {
				allPhotoAlbumsData = fullFolderData
				console.log('allPhotoAlbumsData: ', allPhotoAlbumsData)
				handleFilterPreviews()
			})
	}

	function handleFilterPreviews() {
		allPhotoAlbumsData.forEach(({ resources }) => {
			if (resources.length) {
				// console.log('folder context: ', resources[0].context)
				// TODO: uncomment once you tag the photos you want to preview from each folder (the first image for one folder is currently private). Also, remove array index from `resources` since you'll be query the images directly
				if (!resources[0].context.isPrivate) {
					photoAlbumsPreviewData = [...photoAlbumsPreviewData, {
						previewImgUrl: resources[0].url,
						// TODO: remove folder if you end up not being able to assign metacontext to it
						folderPath: resources[0].folder,
						imgContext: resources[0].context || null
					}]
				}
			} 
		})
		console.log('photoAlbumsPreviewData: ', photoAlbumsPreviewData)
	}

	function checkLocalStorage() {
		const folderInfo = JSON.parse(localStorage.getItem('photoAlbumFolderInfo'))
		// console.log(`folderInfo: `, folderInfo)
		if (!folderInfo) {
			console.log('no folder info in storage')
			getPhotoAlbumsFolderInfo()
				.then(({ folders }) => {
					localStorage.setItem('photoAlbumFolderInfo', JSON.stringify(folders))
					// console.log(`photoAlbumsFolderInfo: `, photoAlbumsFolderInfo)
					getPhotoAlbumsData(folders) 
				})
		} else { 
			console.log('folder info already in storage')
			getPhotoAlbumsData(folderInfo) 
		}
	}
	
	checkLocalStorage()
</script>

<main>
	<h1>My Photo Albums</h1>

	{#each photoAlbumsPreviewData as { previewImgUrl, folderPath, imgContext }}
		<a 
			href={`/album/${folderPath}`} 
			class='album_preview_grid_container'
		>
			<img 
				src={previewImgUrl} 
				alt={`My photo from Plummer Peak Trail`}
				width='300px'
				class='album_image'
			/>

			<div class='album_description'>
				<p class='album_name'>{imgContext.display_location}</p>
				<p class='album_date'>{imgContext.date}</p>
			</div>
		</a>
	{/each}

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

	img {
		object-fit: contain;
	}

	.album_image {
		align-self: stretch;
	}

	.album_preview_grid_container {
		display: grid;
		grid-template-columns: 1fr 4fr;
		box-shadow: 1px 1px 5px 0 rgb(244, 235, 235);
		border: 1px solid rgb(244, 235, 235);
		margin-top: 10px;
	}

	.album_description {
		justify-self: center;
		place-self: center;
		font-size: 2em;
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