import sharp from 'sharp'

const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="80" fill="#c7171a"/>
  <text x="256" y="340" font-family="Arial Black, Arial" font-weight="900" font-size="260" text-anchor="middle" fill="white">FL</text>
</svg>`)

await sharp(svg).resize(192, 192).png().toFile('public/icons/icon-192.png')
await sharp(svg).resize(512, 512).png().toFile('public/icons/icon-512.png')
await sharp(svg).resize(180, 180).png().toFile('public/apple-touch-icon.png')
console.log('Icons generated')
