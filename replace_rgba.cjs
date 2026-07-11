const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const rgbaReplacements = [
    // Cyan
    { regex: /rgba\(\s*0\s*,\s*217\s*,\s*255\s*,/g, replacement: 'rgba(255, 191, 0,' },
    // Purple
    { regex: /rgba\(\s*168\s*,\s*85\s*,\s*247\s*,/g, replacement: 'rgba(255, 191, 0,' },
    // Pink
    { regex: /rgba\(\s*255\s*,\s*0\s*,\s*80\s*,/g, replacement: 'rgba(255, 191, 0,' },
    // Neon Cyan
    { regex: /rgba\(\s*0\s*,\s*242\s*,\s*254\s*,/g, replacement: 'rgba(255, 217, 102,' }
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            processDirectory(filePath);
        } else if (file.endsWith('.astro') || file.endsWith('.tsx') || file.endsWith('.css') || file.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;
            for (const rule of rgbaReplacements) {
                if (content.match(rule.regex)) {
                    content = content.replace(rule.regex, rule.replacement);
                    modified = true;
                }
            }
            if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log('Updated RGBA:', filePath);
            }
        }
    }
}
processDirectory(srcDir);
