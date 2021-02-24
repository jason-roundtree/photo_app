<script>
	// export let name;
	// async function getPhotos() {
	// 	const res = await fetch('http://localhost:9000/photos')
	// 	const json = await res.json()
	// 	console.log('json: ', json)
		
	// 	if (res.ok) {
	// 		return json
	// 	} else {
	// 		throw new Error(text)
	// 	}
	// }
	
	// let promise = getPhotos()
</script>

<div class='photo_album_group_container'>
	<!-- {#await promise}
	<p>...loading</p>
	{:then photos}
		{#each photos.resources as photo}
			<img 
				src={photo.url} 
				alt={`My photo from Plummer Peak Trail`}
				width='300px'
				height='300px'
			/>
		{/each}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await} -->
</div>

<style>
	img {
		object-fit: contain;
	}
    
	/* @media (min-width: 640px) {
		main {
			max-width: none;
		}
	} */
</style>