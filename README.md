# WAITT Dictionary

Chunked English-to-Afrikaans technical web dictionary. Both components are designed to run on static hosting services.

## Components

### Dictionary
A searchable technical dictionary focused on English and Afrikaans computer terminology.
* Uses a two-tier chunking system for performance.
* The first tier provides 5 preview results for single-character searches.
* The second tier provides full results for specific two-character prefixes.
* Optimized for low bandwidth by only fetching the required JSON segments.

## Data Processing

### Text to JSON Conversion
The dictionary data is converted from a text format using a Node.js script.
* Format: English Term ====> Afrikaans Term.
* Output: Standard JSON objects with en and af keys.

### Chunking Logic
To maintain speed without a database, the dictionary is split into small files:
* Standard chunks: Named by the first two characters of the term (e.g., ab.json).
* Preview chunks: Named by the first character (e.g., a.json) containing the top 5 matches.
* Sanitisation: Special characters in filenames are replaced with hyphens to ensure cross-platform compatibility.

# Setup and Usage Instructions

Follow these steps to process the dictionary data and prepare the files for the web interface.

## Convert Text to JSON
This script reads your raw terminology list and creates a structured JSON file.

```bash
node scripts/convert.js
```

## File Structure
* `index.html`: The main portfolio or dictionary interface.
* `scripts/convert.js`: Script to convert raw text to JSON.
* `res/`: Directory containing the processed JSON files and the chunks subdirectory.

## References
* (Casper Labuschagne's Listing)[https://github.com/casperl/Afrikaanse-rekenaarterme]
