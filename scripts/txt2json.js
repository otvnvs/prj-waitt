const fs = require('fs');
const path = require('path');

// Get filename from command line arguments
const fileName = process.argv[2];

if (!fileName) {
  console.error('Usage: node convert.js <filename>');
  process.exit(1);
}

try {
  // Read file content
  const input = fs.readFileSync(fileName, 'utf8');
  
  const result = input
    .split('\n')
    .filter(line => line.includes('====>'))
    .map(line => {
      const [en, af] = line.split('====>').map(s => s.trim());
      return { en, af };
    });

  // Generate output filename (e.g., data.txt -> data.json)
  const outputName = path.parse(fileName).name + '.json';

  // Write to file
  fs.writeFileSync(outputName, JSON.stringify(result, null, 2));
  
  console.log(`Successfully converted ${result.length} items to ${outputName}`);
} catch (err) {
  console.error('Error:', err.message);
}

