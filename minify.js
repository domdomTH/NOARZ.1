/**
 * Simple JavaScript Minifier
 * This script minifies JavaScript code to reduce size and make it harder to read.
 */

const fs = require('fs');

// Check if file path is provided
if (process.argv.length < 3) {
    console.log('Usage: node minify.js <file_path>');
    process.exit(1);
}

const filePath = process.argv[2];

// Read the file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file: ${err}`);
        process.exit(1);
    }

    // Minify the code
    const minifiedCode = minify(data);

    // Write the minified code to a new file
    const outputPath = filePath.replace('.js', '.min.js');
    fs.writeFile(outputPath, minifiedCode, 'utf8', (err) => {
        if (err) {
            console.error(`Error writing file: ${err}`);
            process.exit(1);
        }
        console.log(`Minified code written to ${outputPath}`);
    });
});

/**
 * Minify JavaScript code
 * @param {string} code - The JavaScript code to minify
 * @returns {string} - The minified code
 */
function minify(code) {
    // Remove comments
    code = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    
    // Remove whitespace
    code = code.replace(/\s+/g, ' ');
    
    // Remove spaces around operators
    code = code.replace(/\s*([=+\-*/%&|^<>!?:;,.()])\s*/g, '$1');
    
    // Remove unnecessary semicolons
    code = code.replace(/;+/g, ';');
    
    // Remove spaces after keywords
    code = code.replace(/\b(if|for|while|switch|catch|function|return|var|let|const)\b\s+/g, '$1');
    
    // Remove newlines
    code = code.replace(/[\r\n]+/g, '');
    
    return code;
}
