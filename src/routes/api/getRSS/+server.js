import parse from 'rss-to-json'
import { json } from '@sveltejs/kit'

// export const prerender = true

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  let feeds = []
  const { startDate, URLs } = await request.json()
  const response = await Promise.all(
    URLs.map(async webURL => await parse('https://' + webURL + '/feed/'))
  )

  response.map(rss => {
    // const { link, items } = await rss
    const items = rss.items.filter(
      item =>
        item.description.match(/indramayu/i) !== null &&
        new Date(item.published) > new Date(startDate)
    )

    if (items.length && items[0]?.title) {
      feeds.push({ link: rss.link, items })
      // console.log('==================final=====================', feeds,'==================final=====================')
    }
    // console.log('selesai', new Date())
  })

  return json(feeds)
}
