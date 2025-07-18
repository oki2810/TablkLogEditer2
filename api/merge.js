// pages/api/merge.js
import { load } from 'cheerio'

export default async function handler(req, res) {
  const { url } = req.query
  if (!url) return res.status(400).send('Missing url parameter')

  const { origin, pathname: path } = new URL(url)
  const merged = []
  let page = 1

  while (1) {
    const pageUrl = page === 1
      ? `${origin}${path}`
      : `${origin}${path}?page=${page}`

    // ← include browser cookies here!
    const resp = await fetch(pageUrl, {
      headers: {
        'cookie': req.headers.cookie || '',
        'user-agent': req.headers['user-agent'] || 'Mozilla/5.0',
      }
    })
    if (!resp.ok) break

    const html = await resp.text()
    const $ = load(html)
    const content = $('.p-backlog-content')
    if (!content.length) break

    merged.push(content.html())
    page++
  }

  const output = `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><title>Merged Backlog</title></head>
<body>
${merged.join('\n')}
</body>
</html>`

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Content-Disposition', 'attachment; filename=backlog.html')
  res.send(output)
}
