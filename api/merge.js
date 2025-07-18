// pages/api/merge.js
import { load } from 'cheerio'

export default async function handler(req, res) {
  const { url } = req.query
  if (!url) return res.status(400).send('Missing url parameter')

  try {
    const base = new URL(url)
    const { origin, pathname: path } = base
    const mergedContents = []
    let page = 1

    while (1) {
      const pageUrl =
        page === 1
          ? `${origin}${path}`
          : `${origin}${path}?page=${page}`

      const resp = await fetch(pageUrl)
      if (!resp.ok) break

      const html = await resp.text()
      const $ = load(html)
      const div = $('.p-backlog-content')
      if (!div.length) break

      mergedContents.push(div.html())
      page++
    }

    const output = `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>Merged Backlog</title></head>
<body>
${mergedContents.join('\n')}
</body>
</html>`

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=backlog.html'
    )
    res.send(output)

  } catch (err) {
    console.error(err)
    res.status(500).send('Internal Server Error')
  }
}
