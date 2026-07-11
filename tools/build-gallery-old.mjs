import { readdir, readFile, writeFile } from 'node:fs/promises'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const rootPath = fileURLToPath(root)
const assetRoot = fileURLToPath(new URL('../cs2/', import.meta.url))
const output = new URL('../gallery.html', import.meta.url)

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await walk(path))
    else if (extname(entry.name).toLowerCase() === '.svg') files.push(path)
  }
  return files
}

const files = (await walk(assetRoot)).sort()
const cards = files.map((file) => {
  const path = relative(rootPath, file)
  const name = file.split('/').pop().replace(/\.svg$/i, '')
  const category = path.split('/').slice(1, -1).join(' / ')
  return `<button class="card" data-search="${`${name} ${category}`.toLowerCase()}" data-path="${path}">
    <span class="preview"><img loading="lazy" src="${path}" alt="${name}"></span>
    <strong>${name}</strong><small>${category}</small>
  </button>`
}).join('\n')

const html = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>CS2 HUD Assets</title><style>
:root{color-scheme:dark;font:14px/1.4 Inter,system-ui,sans-serif;background:#111318;color:#f5f5f5}*{box-sizing:border-box}
body{margin:0}header{position:sticky;top:0;z-index:2;padding:18px 24px;background:#111318eF;backdrop-filter:blur(12px);border-bottom:1px solid #2a2e36}
h1{font-size:20px;margin:0 0 12px}input{width:min(600px,100%);padding:11px 14px;border:1px solid #3a404b;border-radius:9px;background:#1b1e25;color:#fff}
#count{margin-left:12px;color:#9da5b4}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;padding:24px}
.card{text-align:left;color:inherit;border:1px solid #292e37;border-radius:11px;padding:10px;background:#191c22;cursor:pointer;min-width:0}.card:hover{border-color:#d6a640;background:#20242c}
.preview{display:grid;place-items:center;height:88px;margin-bottom:9px;border-radius:7px;background:#f0f1f3}.preview img{max-width:90%;max-height:72px}.card strong,.card small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.card small{color:#8992a2;margin-top:3px;font-size:11px}.hidden{display:none}
#toast{position:fixed;right:20px;bottom:20px;padding:10px 14px;border-radius:8px;background:#d6a640;color:#111;opacity:0;transition:.2s}#toast.show{opacity:1}
</style></head><body><header><h1>CS2 HUD SVG 素材库</h1><input id="search" autofocus placeholder="搜索 ak47、flashbang、skillgroups、map_icons…"><span id="count">${files.length} 个 SVG</span></header>
<main class="grid">${cards}</main><div id="toast">已复制相对路径</div><script>
const cards=[...document.querySelectorAll('.card')],input=document.querySelector('#search'),count=document.querySelector('#count'),toast=document.querySelector('#toast');
input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();let n=0;for(const card of cards){const show=card.dataset.search.includes(q);card.classList.toggle('hidden',!show);if(show)n++}count.textContent=n+' 个 SVG'});
document.addEventListener('click',async e=>{const card=e.target.closest('.card');if(!card)return;await navigator.clipboard.writeText(card.dataset.path);toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),1000)});
</script></body></html>`

await writeFile(output, html)
console.log(`Generated gallery.html with ${files.length} SVG assets`)
