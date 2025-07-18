// pages/api/merge.js
import cheerio from 'cheerio'

export default async function handler(req, res) {
    const { url } = req.query
    if (!url) {
        return res.status(400).send('Missing url parameter')
    }

    try {
        const base = new URL(url)
        const origin = base.origin
        const path = base.pathname
        const mergedContents = []
        let page = 1

        while (true) {
            // 1ページ目は ?page=1 を付けず、それ以降は ?page=2,3…
            const pageUrl = page === 1
                ? `${origin}${path}`
                : `${origin}${path}?page=${page}`

            const resp = await fetch(pageUrl)
            if (!resp.ok) break

            const html = await resp.text()
            const $ = cheerio.load(html)
            const div = $('.p-backlog-content')
            if (div.length === 0) break

            mergedContents.push(div.html())
            page++
        }

        // 結合してひとつの HTML にまとめる
        const output = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>Backlog Merge</title>
</head>
<body>
${mergedContents.join('\n')}
</body>
</html>`

        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        // ブラウザにダウンロードさせる
        res.setHeader('Content-Disposition', 'attachment; filename=backlog.html')
        res.send(output)

    } catch (err) {
        console.error(err)
        res.status(500).send('Internal Server Error')
    }
}
