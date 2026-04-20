const fs = require('fs');
const path = require('path');

const inputPath = './res/afrikaanse-rekenaarterme.json';
const outputDir = './res/chunks';

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

function run() {
    const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    
    // Sort data alphabetically by English term for consistent previews
    data.sort((a, b) => a.en.localeCompare(b.en));

    const chunks = {};
    const previews = {}; // Store first 5 for each letter a-z

    data.forEach(item => {
        const firstLetter = item.en[0].toLowerCase();
        const prefix = item.en.substring(0, 2).toLowerCase().padEnd(2, '_').replace(/[^a-z0-9_]/g, '-');

        // 1. Group for 2-char chunks
        if (!chunks[prefix]) chunks[prefix] = [];
        chunks[prefix].push(item);

        // 2. Group for 1-char previews (up to 5)
        if (!previews[firstLetter]) previews[firstLetter] = [];
        if (previews[firstLetter].length < 5) {
            previews[firstLetter].push(item);
        }
    });

    // Write 2-char chunks
    Object.keys(chunks).forEach(p => {
        fs.writeFileSync(path.join(outputDir, `${p}.json`), JSON.stringify(chunks[p]));
    });

    // Write 1-char preview chunks (a.json, b.json, etc)
    Object.keys(previews).forEach(letter => {
        if (/[a-z]/.test(letter)) {
            fs.writeFileSync(path.join(outputDir, `${letter}.json`), JSON.stringify(previews[letter]));
        }
    });

    fs.writeFileSync(path.join(outputDir, 'map.json'), JSON.stringify(Object.keys(chunks)));
    console.log("Chunks and Previews created.");
}
run();

