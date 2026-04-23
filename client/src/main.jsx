import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// rootのオリジナルサイズ
const ROOT_WIDTH = 1376
const ROOT_HEIGHT = 942

// 初回のビューポートサイズを保持（キーボード出現時の変動を無視）
let initialInnerHeight = window.innerHeight

// scaleを計算して適用
function updateScale() {
  const root = document.getElementById('root')
  if (!root) return
  
  const bodyWidth = window.innerWidth
  const bodyHeight = initialInnerHeight // 初回値を使い続ける
  
  const scaleWidth = bodyWidth / ROOT_WIDTH
  const scaleHeight = bodyHeight / ROOT_HEIGHT
  
  // 縦横比を守るため、より小さいスケール値を使用
  const scale = Math.min(scaleWidth, scaleHeight)
  
  root.style.setProperty('--scale', scale.toString())
}

// 初期化とリサイズイベント
updateScale()
window.addEventListener('resize', updateScale)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
