const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// Map old colors to new colors
const colorReplacements = [
    // Backgrounds to Navy
    { regex: /bg-\[#010205\]/g, replacement: 'bg-[#1B1F3B]' },
    { regex: /bg-\[#02040A\]/g, replacement: 'bg-[#1B1F3B]' },
    { regex: /bg-\[#050814\]/g, replacement: 'bg-[#14172E]' }, // Slightly deeper navy for cards
    { regex: /bg-\[#060b1a\]/g, replacement: 'bg-[#14172E]' },
    
    // Cyan to Gold
    { regex: /#00d9ff/gi, replacement: '#FFBF00' },
    
    // Purple to Gold
    { regex: /#a855f7/gi, replacement: '#FFBF00' },
    { regex: /purple-500/gi, replacement: '[#FFBF00]' },
    { regex: /purple-400/gi, replacement: '[#FFBF00]' },
    
    // Pink to Gold
    { regex: /#ff0050/gi, replacement: '#FFBF00' },
    { regex: /pink-500/gi, replacement: '[#FFBF00]' },
    
    // Other Neon Cyan to Gold
    { regex: /#00f2fe/gi, replacement: '#FFBF00' },
    { regex: /#0055ff/gi, replacement: '#FFD966' }, // Gold soft for secondary
    { regex: /blue-500/gi, replacement: '[#FFBF00]' },
    { regex: /green-500/gi, replacement: '[#FFBF00]' } // Found in some cards
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
            
            for (const rule of colorReplacements) {
                if (content.match(rule.regex)) {
                    content = content.replace(rule.regex, rule.replacement);
                    modified = true;
                }
            }
            
            if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log('Updated:', filePath);
            }
        }
    }
}

processDirectory(srcDir);
