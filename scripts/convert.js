const fs = require('fs');
const path = require('path');

/**
 * CONFIGURATION
 * Edit these paths as needed
 */
const INPUT_TXT = './res/afrikaanse-rekenaarterme.txt';
const MASTER_JSON = './res/afrikaanse-rekenaarterme.json';
const CHUNK_DIR = './res/chunks';
const PREFIX_LEN = 2;
const PREVIEW_LIMIT = 5;

function run() {
    console.log('--- Starting Processing ---');

    // 1. ENSURE DIRECTORIES EXIST
    if (!fs.existsSync(CHUNK_DIR)) {
        fs.mkdirSync(CHUNK_DIR, { recursive: true });
        console.log(`Created directory: ${CHUNK_DIR}`);
    }

    try {
        // 2. READ AND CONVERT TXT TO JSON
        if (!fs.existsSync(INPUT_TXT)) {
            console.error(`Error: Source file not found at ${INPUT_TXT}`);
            return;
        }

        const rawText = fs.readFileSync(INPUT_TXT, 'utf8');
        const data = rawText
            .split('\n')
            .filter(line => line.includes('====>'))
            .map(line => {
                const [en, af] = line.split('====>').map(s => s.trim());
                return { en, af };
            });

        // Sort alphabetically by English term for consistent chunks and previews
        data.sort((a, b) => a.en.localeCompare(b.en));

        // Save the master JSON file
        fs.writeFileSync(MASTER_JSON, JSON.stringify(data, null, 2));
        console.log(`Converted ${data.length} terms to ${MASTER_JSON}`);

        // 3. CHUNKING LOGIC
        const chunks = {};
        const previews = {};

        data.forEach(item => {
            const firstChar = item.en.charAt(0).toLowerCase();
            
            // Generate sanitised 2-char prefix
            let prefix = item.en.substring(0, PREFIX_LEN).toLowerCase().padEnd(PREFIX_LEN, '_');
            prefix = prefix.replace(/[^a-z0-9_]/g, '-');

            // Group for 2-char chunks
            if (!chunks[prefix]) chunks[prefix] = [];
            chunks[prefix].push(item);

            // Group for 1-char previews (a.json, b.json, etc.)
            if (/[a-z0-9]/.test(firstChar)) {
                if (!previews[firstChar]) previews[firstChar] = [];
                if (previews[firstChar].length < PREVIEW_LIMIT) {
                    previews[firstChar].push(item);
                }
            }
        });

        // 4. WRITE FILES TO DISK
        
        // Write 2-char chunks
        Object.keys(chunks).forEach(p => {
            fs.writeFileSync(path.join(CHUNK_DIR, `${p}.json`), JSON.stringify(chunks[p]));
        });

        // Write 1-char preview chunks
        Object.keys(previews).forEach(letter => {
            fs.writeFileSync(path.join(CHUNK_DIR, `${letter}.json`), JSON.stringify(previews[letter]));
        });

        // Write map.json (index of all available 2-char chunks)
        const mapData = Object.keys(chunks);
        fs.writeFileSync(path.join(CHUNK_DIR, 'map.json'), JSON.stringify(mapData));

        console.log(`Successfully created ${mapData.length} data chunks and ${Object.keys(previews).length} preview files.`);
        console.log('--- Processing Complete ---');

    } catch (err) {
        console.error('An error occurred during processing:', err.message);
    }
}

run();

