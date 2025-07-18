// pages/index.js
import { useState } from 'react'

export default function Home() {
    const [url, setUrl] = useState('')

    return (
        <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
            <h1>Backlog Merger</h1>
            <input
                type="text"
                placeholder="例: https://tablk.herokuapp.com/sessions/103357/backlog"
                value={url}
                onChange={e => setUrl(e.target.value)}
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                }}
            />
            <button
                onClick={() => {
                    if (!url) return
                    // API に URL を渡してリダイレクト → ダウンロード開始
                    window.location.href = `/api/merge?url=${encodeURIComponent(url)}`
                }}
                style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    fontSize: '1rem',
                    cursor: 'pointer'
                }}
            >
                HTML をダウンロード
            </button>
        </div>
    )
}