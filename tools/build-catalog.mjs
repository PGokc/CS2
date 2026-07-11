import { readdir, writeFile } from 'node:fs/promises'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const assets = join(root, 'assets')
const catalogDir = join(root, 'catalog')

async function walk(dir) {
  const result = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) result.push(...await walk(path))
    else if (['.png', '.svg'].includes(extname(entry.name).toLowerCase())) result.push(path)
  }
  return result
}

const files = (await walk(assets)).sort().map((path) => {
  const file = relative(root, path)
  const parts = file.split('/')
  return {
    file,
    kind: parts[1],
    group: parts.slice(1, -1).join('/'),
    name: parts.at(-1).replace(/\.(png|svg)$/i, ''),
    format: extname(path).slice(1),
  }
})

const maps = [...new Set(files.flatMap((item) => {
  const match = item.name.match(/^(ar|cs|de)_[a-z0-9]+/)
  return match ? [match[0]] : []
}))].sort()

await writeFile(join(catalogDir, 'assets.json'), JSON.stringify({ generatedAt: new Date().toISOString(), count: files.length, files }, null, 2))
await writeFile(join(catalogDir, 'maps.json'), JSON.stringify({ generatedAt: new Date().toISOString(), count: maps.length, maps }, null, 2))

const cards = files.map(({ file, group, name }) => `<button class="card" data-search="${`${name} ${group}`.toLowerCase()}" data-path="../${file}"><span class="preview"><img loading="lazy" src="../${file}" alt="${name}"></span><strong>${name}</strong><small>${group}</small></button>`).join('\n')
const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CS2 Asset Library</title><style>:root{color-scheme:dark;font:14px/1.4 system-ui;background:#111318;color:#f5f5f5}*{box-sizing:border-box}body{margin:0}header{position:sticky;top:0;z-index:2;padding:18px 24px;background:#111318ef;border-bottom:1px solid #2a2e36}h1{font-size:20px;margin:0 0 12px}input{width:min(620px,100%);padding:11px 14px;border:1px solid #3a404b;border-radius:9px;background:#1b1e25;color:#fff}#count{margin-left:12px;color:#9da5b4}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:12px;padding:24px}.card{text-align:left;color:inherit;border:1px solid #292e37;border-radius:11px;padding:10px;background:#191c22;cursor:pointer;min-width:0}.card:hover{border-color:#d6a640}.preview{display:grid;place-items:center;height:110px;margin-bottom:9px;border-radius:7px;background:#e8e9eb;overflow:hidden}.preview img{width:100%;height:100%;object-fit:contain}.card strong,.card small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.card small{color:#8992a2;font-size:11px}.hidden{display:none}#toast{position:fixed;right:20px;bottom:20px;padding:10px 14px;border-radius:8px;background:#d6a640;color:#111;opacity:0}#toast.show{opacity:1}</style></head><body><header><h1>CS2 Asset Library</h1><input id="search" autofocus placeholder="搜索地图、武器、HUD、radar、loading…"><span id="count">${files.length} 个素材</span></header><main class="grid">${cards}</main><div id="toast">已复制路径</div><script>const cards=[...document.querySelectorAll('.card')],input=document.querySelector('#search'),count=document.querySelector('#count'),toast=document.querySelector('#toast');input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();let n=0;for(const card of cards){const show=card.dataset.search.includes(q);card.classList.toggle('hidden',!show);if(show)n++}count.textContent=n+' 个素材'});document.addEventListener('click',async e=>{const card=e.target.closest('.card');if(!card)return;await navigator.clipboard.writeText(card.dataset.path);toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),900)});</script></body></html>`
await writeFile(join(catalogDir, 'gallery.html'), html)
console.log(`Catalog generated: ${files.length} assets across ${maps.length} maps`)
