<script>
	import { onMount } from 'svelte'
	import { parse } from 'rss-to-json'

	const yangkenacors = [
		'cuplik.com',
		'fokuspantura.com',
		'mediasuaramabes.com',
		'radarinformasi.com',
		'tanganrakyat.id',
		'suarajurnalis.online',
		'reformasi.co.id',
		'ringsatu.com',
		'pilarteduh.com'
	]

	const yangnofeed = ['jurnalnews.id', 'suarakarya.id', 'gatra.com']

	const webs = [
		'beritanyainfo.com',
		'bidiknasional.com',
		'ciremaitoday.com',
		'cuplik.com',
		'demokratis.co.id',
		'e-satu.com',
		'gayabekasi.id',
		'indramayunews.id',
		'jayantaranews.com',
		'jurnalnews.id',
		'jurnalpelita.com',
		'kicaunews.com',
		'mabesbharindo.com',
		'cirebonraya.com',
		'mhnews.id',
		// 'diskominfo.indramayukab.go.id',
		'detik.com/jabar',
		'kumparan.com',
		'tribunjabar.id',
		'mandalapos.co.id',
		'mediasuaramabes.com',
		'metropostnews.com',
		'min.co.id',
		'netsembilan.com',
		'pilarteduh.com',
		'radarinformasi.com',
		'rednews.my.id',
		'ringsatu.id',
		'statusrakyat.com',
		'suaraaktual.co',
		'tanganrakyat.id',
		'reformasi.co.id',
		'suarajurnalis.online',
		'indometro.id',
		'indramayukab.go.id',
		'suarakarya.id',
		'mpn.co.id',
		'fokuspantura.com',
		'kreatorjabar.com'
	]

	let feeds = []

	async function fetchNews() {
		const CORS_PROXY = 'https://api.allorigins.win/raw?url='

		webs.map(async webURL => {
			try {
				// const res = await fetch(CORS_PROXY + 'https://'+ webURL + '/feed/', {
				//   mode: 'no-cors',
				//   // headers: {
				//   //   'x-cors-api-key': 'temp_87094b77924ee0f7618a9f9c19f8e99c'
				//   // }
				// })
				// const items = (await parse(await res.text())).items
				const yesterday = new Date()
				yesterday.setDate(yesterday.getDate() - 1)

				const items = (await parse(CORS_PROXY + 'https://' + webURL + '/feed/')).items.filter(
					item =>
						new Date(item.published).setHours(0, 0, 0) > yesterday.setHours(18, 0, 0) &&
						item.description.match(/indramayu/i)
				)
				console.log(webURL, items)

				// .filter(item => item.description.match(/indramayu/i))
				// console.log(items[0]?.title)
				if (items[0]?.title) feeds.push({ webURL, items })
				feeds = feeds
			} catch (e) {
				console.log(e)
			}
		})
		console.log(feeds)
	}

	onMount(fetchNews)
</script>

{#if feeds.length}
	{#each feeds as feed (feed.webURL)}
		{#if feed.items.length}
			<table role="grid">
				<thead>
					<tr>
						<th style="width:10%;min-width: 10%;max-width: 10%">NO</th>
						<th style="width:25%;min-width: 25%;max-width: 25%">Judul</th>
						<th style="width:25%;min-width: 25%;max-width: 25%">Link</th>
						<th style="width:20%;min-width: 20%;max-width: 20%">Wartawan</th>
						<th style="width:20%;min-width: 20%;max-width: 20%">Kategori</th>
					</tr>
					<tr>
						<th colspan="5" class="title"><a href={feed.webURL}>{feed.webURL}</a></th>
					</tr>
				</thead>

				<tbody>
					{#each feed.items as item, i (item.id)}
						<tr>
							<td class="text-center">{i + 1}</td>
							<td>{item.title}</td>
							<td
								><a href={item.link.replace(/(#.*|\?.*)/, '')}
									>{item.link.replace(/(#.*|\?.*)/, '')}</a
								></td
							>
							<td>&nbsp;</td>
							<td>&nbsp;</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<p>&nbsp;</p>
		{/if}
	{/each}
{:else}
	<p>tidak ada berita</p>
{/if}

<style>
	@media print, screen {
		* {
			font-family: Calibri;
		}

		table {
			display: table;
		}

		table,
		table th,
		table td {
			border: 1px solid;
			border-spacing: 0;
			border-collapse: collapse;
			text-align: center;
		}

		table th {
			font-weight: bold;
		}

		table th.title {
			font-size: 125%;
		}

		table thead tr:first-child {
			background: lightgray;
		}

		table tr {
			display: table-row;
		}

		table td {
			display: table-cell;
		}
		a {
			color: blue;
		}
	}
</style>
