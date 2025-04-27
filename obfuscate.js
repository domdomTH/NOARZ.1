/**
 * Simple JavaScript Obfuscator
 * This script obfuscates JavaScript code to make it harder to read and understand.
 */

const fs = require('fs');

// Check if file path is provided
if (process.argv.length < 3) {
    console.log('Usage: node obfuscate.js <file_path>');
    process.exit(1);
}

const filePath = process.argv[2];

// Read the file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file: ${err}`);
        process.exit(1);
    }

    // Obfuscate the code
    const obfuscatedCode = obfuscate(data);

    // Write the obfuscated code to a new file
    const outputPath = filePath.replace('.js', '.obfuscated.js');
    fs.writeFile(outputPath, obfuscatedCode, 'utf8', (err) => {
        if (err) {
            console.error(`Error writing file: ${err}`);
            process.exit(1);
        }
        console.log(`Obfuscated code written to ${outputPath}`);
    });
});

/**
 * Obfuscate JavaScript code
 * @param {string} code - The JavaScript code to obfuscate
 * @returns {string} - The obfuscated code
 */
function obfuscate(code) {
    // Step 1: Remove comments
    code = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
    
    // Step 2: Generate random variable names
    const variableNames = {};
    const functionNames = {};
    
    // Find all variable declarations
    const varRegex = /\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;
    let match;
    while ((match = varRegex.exec(code)) !== null) {
        const varName = match[2];
        if (!variableNames[varName] && !isReservedWord(varName)) {
            variableNames[varName] = generateRandomName(5);
        }
    }
    
    // Find all function declarations
    const funcRegex = /\bfunction\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;
    while ((match = funcRegex.exec(code)) !== null) {
        const funcName = match[1];
        if (!functionNames[funcName] && !isReservedWord(funcName)) {
            functionNames[funcName] = generateRandomName(5);
        }
    }
    
    // Step 3: Replace variable and function names
    for (const [original, replacement] of Object.entries(variableNames)) {
        const regex = new RegExp(`\\b${original}\\b`, 'g');
        code = code.replace(regex, replacement);
    }
    
    for (const [original, replacement] of Object.entries(functionNames)) {
        const regex = new RegExp(`\\b${original}\\b`, 'g');
        code = code.replace(regex, replacement);
    }
    
    // Step 4: Add anti-debugging code
    const antiDebuggingCode = `
    (function() {
        setInterval(function() {
            debugger;
        }, 100);
        
        const devTools = function() {
            console.clear();
            if (window.devtools && window.devtools.open) {
                alert("Developer tools detected! This is a protected application.");
                window.location.href = "about:blank";
            }
        };
        
        // Detect devtools
        const devToolsDetector = new Image();
        Object.defineProperty(devToolsDetector, 'id', {
            get: function() {
                devTools();
            }
        });
        
        console.log('%c', devToolsDetector);
        
        // Disable right-click
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
        
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        document.addEventListener('keydown', function(e) {
            if (
                e.keyCode === 123 || // F12
                (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
                (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
                (e.ctrlKey && e.keyCode === 85) // Ctrl+U
            ) {
                e.preventDefault();
                return false;
            }
        });
    })();
    `;
    
    // Step 5: Add string encryption
    code = encryptStrings(code);
    
    // Step 6: Add the anti-debugging code
    code = antiDebuggingCode + code;
    
    // Step 7: Wrap in self-executing function for scope isolation
    code = `(function() { ${code} })();`;
    
    return code;
}

/**
 * Generate a random name
 * @param {number} length - The length of the name
 * @returns {string} - A random name
 */
function generateRandomName(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';
    let result = chars.charAt(Math.floor(Math.random() * 54)); // First char must be a letter, _ or $
    for (let i = 1; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Check if a word is a reserved JavaScript keyword
 * @param {string} word - The word to check
 * @returns {boolean} - True if the word is reserved
 */
function isReservedWord(word) {
    const reservedWords = [
        'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 
        'delete', 'do', 'else', 'export', 'extends', 'false', 'finally', 'for', 'function', 
        'if', 'import', 'in', 'instanceof', 'new', 'null', 'return', 'super', 'switch', 
        'this', 'throw', 'true', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
        'let', 'static', 'enum', 'await', 'implements', 'package', 'protected', 'interface',
        'private', 'public'
    ];
    return reservedWords.includes(word);
}

/**
 * Encrypt string literals in the code
 * @param {string} code - The JavaScript code
 * @returns {string} - The code with encrypted strings
 */
function encryptStrings(code) {
    // Find all string literals
    const stringRegex = /'([^'\\]*(\\.[^'\\]*)*)'|"([^"\\]*(\\.[^"\\]*)*)"/g;
    
    return code.replace(stringRegex, function(match) {
        // Skip empty strings
        if (match === "''" || match === '""') {
            return match;
        }
        
        // Remove quotes
        const str = match.substring(1, match.length - 1);
        
        // Simple XOR encryption
        const encrypted = Array.from(str)
            .map(char => char.charCodeAt(0) ^ 0x7F) // XOR with 0x7F
            .map(code => code.toString(16).padStart(2, '0'))
            .join('');
        
        // Return a function that decrypts the string at runtime
        return `(function() { 
            return String.fromCharCode.apply(null, 
                "${encrypted}".match(/.{1,2}/g).map(c => parseInt(c, 16) ^ 0x7F)
            ); 
        })()`;
    });
}
