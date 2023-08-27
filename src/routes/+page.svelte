<script>
  import { onMount } from 'svelte'
  import { parse } from 'rss-to-json'

  const yangkenacors = [
    'cuplik.com' // nggak bsa karena format rss bukan xml
  ]

  const yangnofeed = [
    'jurnalnews.id',
    'suarakarya.id',
    'gatra.com',
    // 'tribunjabar.id',
    'indometro.id',
    'suaraaktual.co',
    'statusrakyat.com',
    'rednews.my.id',
    'netsembilan.com',
    // 'kumparan.com',
    'cirebonraya.com',
    'detik.com/jabar',
    'jurnalnews.id',
    'jayantaranews.com',
    'e-satu.com'
  ]

  const webs = [
    'beritanyainfo.com',
    'bidiknasional.com',
    'ciremaitoday.com',
    'demokratis.co.id',
    'gayabekasi.id',
    'indramayunews.id',
    'jurnalpelita.com',
    'kicaunews.com',
    'mhnews.id',
    //// 'diskominfo.indramayukab.go.id',
    'mandalapos.co.id',
    'mediasuaramabes.com',
    'metropostnews.com',
    'pilarteduh.com',
    'radarinformasi.com',
    'ringsatu.id',
    'tanganrakyat.id',
    'reformasi.co.id',
    'suarajurnalis.online',
    //// 'indramayukab.go.id',
    'mpn.co.id',
    'fokuspantura.com',
    'kreatorjabar.com',

    // yang cors udah bisa, mantap
    'mediasuaramabes.com',
    // 'ringsatu.com',
    'min.co.id',
    'mabesbharindo.com'
  ]

  let feeds = []

  function getDayName(dateStr) {
    var date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', { weekday: 'long' })
  }

  let dayoff = 0
  const today = new Date()
  let startDate
  $: {
    startDate = new Date()
    startDate.setDate(startDate.getDate() - (getDayName(today) === 'Senin' ? -4 : -1) - dayoff)
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
    const response = await fetch('/api/getRSS', {
      method: 'POST',
      body: JSON.stringify({ startDate, URLs: webs }),
      headers: {
        'content-type': 'application/json'
      }
    })
    feeds = await response.json()
  }
</script>

<input type="number" bind:value={dayoff} min="0" max="2" />
<p>
  mulai:
  <time>{localDateTime.format(startDate)}</time>
</p>
<p>
  sampai:
  <time>{localDateTime.format(new Date().setHours(18, 0, 0))}</time>
</p>

<button on:click={fetchNews}>get berita</button>
{#if feeds.length}
  {#each feeds as feed (feed.link)}
    {#if feed.items.length}
      <table role="grid">
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
            <th colspan="5" class="title"><a href={feed.link}>{feed.link}</a></th>
          </tr>
        </thead>

        <tbody>
          {#each feed.items as item, i (item.id)}
            <!--          <tr>-->
            <!--            <td colspan="3">-->
            <!--              {new Date(item.published)} | {new Date(new Date(item.published).setHours(0, 0, 0))}-->
            <!--            </td>-->
            <!--          </tr>-->
            <tr>
              <td class="text-center">{i + 1}</td>
              <td>{item.title}</td>
              <!--            <td>-->
              <!--              <time>{localDateTime.format(new Date(item.published))}</time>-->
              <!--            </td>-->
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
