<script>
  let URLs = [
    'cuplik.com',
    'beritanyainfo.com',
    'bidiknasional.com',
    'ciremaitoday.com',
    'demokratis.co.id',
    'gayabekasi.id',
    'indramayunews.id',
    'jurnalpelita.com',
    'kicaunews.com',
    'mhnews.id',
    'mandalapos.co.id',
    'mediasuaramabes.com',
    'metropostnews.com',
    'pilarteduh.com',
    'radarinformasi.com',
    'ringsatu.id',
    'tanganrakyat.id',
    'reformasi.co.id',
    'suarajurnalis.online',
    'mpn.co.id',
    'fokuspantura.com',
    'kreatorjabar.com',
    'mediasuaramabes.com',
    'min.co.id',
    'mabesbharindo.com',

    //// 'diskominfo.indramayukab.go.id',
    //// 'indramayukab.go.id',
    // yang cors udah bisa, mantap
    // 'ringsatu.com',
  ]

  let feeds = []

  function getDayName(dateStr) {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { weekday: 'long' })
  }

  let dayoff = 0
  const today = new Date()
  let startDate
  $: {
    dayoff = dayoff < 0 ? 0 : dayoff > 2 ? 2 : dayoff
    startDate = new Date()
    startDate.setDate(startDate.getDate() - (getDayName(today) === 'Senin' ? 4 : 1) - dayoff)
    startDate.setHours(18, 0, 0)
    startDate = new Date(startDate)
  }
  export const localDateTime = new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })

  const fetchNews = async () => {
    const response = await Promise.all(
      Array.from(new Set(URLs)).map(async URL => {
        try {
          const rss = await fetch(
            'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2F' + URL + '%2Ffeed%2F&api_key=np3geyfdtctlp3xn6z7h1zqwlfjvkpcksqpj8rh0&order_by=pubDate&order_dir=asc'
          )
          if (!rss.ok) throw new Error(`Failed to fetch: ${rss.status}`)

          let {
            items
          } = await rss.json()

          items = await items.filter(
            item =>
              item.description.match(/indramayu/gi) !== null &&
              new Date(item.pubDate) > new Date(startDate)
          )
          if (items.length && items[0]?.title) {
            feeds.push({ link: URL, items })
            feeds = feeds
            // console.log('==================final=====================', feeds,'==================final=====================')
          }
        } catch (e) {
          return { error: true, message: e }
        }
      })
    )
    // console.log(response)
  }

  // $: console.log(feeds)
</script>

<!--<input type="number" bind:value={dayoff}  />-->
<select bind:value={dayoff}>
  <option value={0} selected>0</option>
  <option value={1}>1</option>
  <option value={2}>2</option>
</select>
<p>
  mulai:
  <time>{localDateTime.format(startDate)}</time>
</p>
<p>
  sampai:
  <time>{localDateTime.format(new Date().setHours(18, 0, 0))}</time>
</p>

<button on:click={fetchNews}>get berita</button>
<br />
read more about this project at
<a href="https://github.com/dansvel/monitoring-berita"
  >https://github.com/dansvel/monitoring-berita</a
>
<hr />
<br />
<!--{#if feeds.length}-->
<table role="grid">
  {#each feeds as feed (feed.link)}
    {#if feed.items.length}
      <thead>
        <tr>
          <th>NO</th>
          <th>Judul Berita</th>
          <!--          <th>waktu</th>-->
          <th>Link</th>
          <th>Wartawan</th>
          <th>Kategori</th>
        </tr>
        <tr>
          <th colspan="5" class="title"><a href={feed.link}>{@html feed.link}</a></th>
        </tr>
      </thead>

      <tbody>
        {#each feed.items as item, i (item.link)}
          <!--          <tr>-->
          <!--            <td colspan="3">-->
          <!--              {new Date(item.published)} | {new Date(new Date(item.published).setHours(0, 0, 0))}-->
          <!--            </td>-->
          <!--          </tr>-->
          <tr>
            <td class="text-center">{i + 1}</td>
            <td>{@html item.title}</td>
            <!--            <td>-->
            <!--              <time>{localDateTime.format(new Date(item.published))}</time>-->
            <!--            </td>-->
            <td
              ><a href={item.link.replace(/(#.*|\?.*)/, '')}
                >{@html item.link.replace(/(#.*|\?.*)/, '')}</a
              ></td
            >
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
        {/each}
      </tbody>
      <td colspan="5">&nbsp;</td>
    {/if}
  {:else}
    <thead>
      <tr>
        <th style="width:10%;min-width: 10%;max-width: 10%">NO</th>
        <th style="width:25%;min-width: 25%;max-width: 25%">Judul Berita</th>
        <!--          <th>waktu</th>-->
        <th style="width:25%;min-width: 25%;max-width: 25%">Link</th>
        <th style="width:20%;min-width: 20%;max-width: 20%">Wartawan</th>
        <th style="width:20%;min-width: 20%;max-width: 20%">Kategori</th>
      </tr>
      <tr>
        <th colspan="5" class="title">https://url</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
    </tbody>
  {/each}
</table>

<!--{:else}-->
<!--  <p>tidak ada berita</p>-->
<!--{/if}-->

<style>
  @media print, screen {
    * {
      font-family: Calibri, sans-serif;
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

    /*a {*/
    /*    color: blue;*/
    /*}*/
  }
</style>
