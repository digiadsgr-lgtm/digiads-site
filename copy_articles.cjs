const fs = require('fs');
const path = require('path');
const SRC = 'C:/Users/avour/Downloads/DIGIADS/articles_to_read';
const DEST = 'src/content/blog';
const MAPPING = [
  ['01_kataskevi-eshop.md','kataskevi-eshop.md'],
  ['02_ga4-tracking-conversions.md','ga4-tracking-conversions.md'],
  ['03_seo-odigos-google.md','seo-odigos-google.md'],
  ['04_google-business-profile.md','google-business-profile.md'],
  ['05_instagram-strategy.md','instagram-strategy-epicheiriseis.md'],
  ['06_branding-optiki-taftotita.md','branding-optiki-taftotita.md'],
  ['07_email-marketing.md','email-marketing.md'],
  ['08_ai-digital-marketing.md','ai-digital-marketing.md'],
];
for (const [sf, df] of MAPPING) {
  let t = fs.readFileSync(path.join(SRC, sf)).toString('utf8');
  t = t.replace(/\r\n/g, '\n');
  t = t.replace(/heroImage: "\/blog\/([^"]+)\.(jpg|png)"/g, 'heroImage: "/blog/$1.webp"');
  fs.writeFileSync(path.join(DEST, df), t, 'utf8');
  console.log('OK:', df);
}
const chk = fs.readFileSync('src/content/blog/kataskevi-eshop.md','utf8').split('\n').slice(0,3).join('\n');
console.log('Check:', chk);
