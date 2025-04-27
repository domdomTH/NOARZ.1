/**
 * Multi-layer Password Protection Integration Script
 * This script integrates all the password protection layers into the website.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Main HTML file path
const htmlFilePath = 'index.html';

// Read the HTML file
fs.readFile(htmlFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file: ${err}`);
        process.exit(1);
    }
    
    // Create a script tag for the JavaScript protection layer
    const scriptContent = `
<script>
// Password protection initialization
(function() {
    // Obfuscated password parts
    const _0x5a7b = ['MDk=', 'ODg=', 'MTE=', 'MzE=', 'Njg4'];
    const _0x3f8c = [
        '${Buffer.from('09').toString('base64')}',
        '${Buffer.from('88').toString('base64')}',
        '${Buffer.from('11').toString('base64')}',
        '${Buffer.from('31').toString('base64')}',
        '${Buffer.from('688').toString('base64')}'
    ];
    
    // Password verification function
    window._verifyAdminPassword = function(password) {
        // Basic validation
        if (!password || password.length !== 10) return false;
        if (password[0] !== '0' || password[4] !== '1') return false;
        
        // Decode the password parts
        try {
            const parts = _0x3f8c.map(p => atob(p));
            const expectedPassword = parts.join('');
            
            // Compare with input
            return password === expectedPassword;
        } catch(e) {
            return false;
        }
    };
    
    // Anti-debugging measures
    const _0x4d2c = function() {
        debugger;
        setTimeout(_0x4d2c, 100);
    };
    _0x4d2c();
    
    // Disable developer tools
    document.addEventListener('keydown', function(e) {
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (
            e.keyCode === 123 || 
            (e.ctrlKey && e.shiftKey && e.keyCode === 73) || 
            (e.ctrlKey && e.shiftKey && e.keyCode === 74) || 
            (e.ctrlKey && e.keyCode === 85)
        ) {
            e.preventDefault();
            return false;
        }
    });
    
    // Disable right-click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Add console warning
    console.log('%cWARNING!', 'color: red; font-size: 30px; font-weight: bold; text-shadow: 1px 1px 2px black;');
    console.log('%cThis is a protected website. Using the developer console may expose you to security risks.', 'color: red; font-size: 16px;');
    
    // Override the original password check function
    const originalCheckPassword = window.checkPassword || function() { return false; };
    window.checkPassword = function(input) {
        // Add multiple layers of verification
        const isValid = _verifyAdminPassword(input);
        const originalResult = originalCheckPassword(input);
        
        // Both must pass for security
        return isValid && originalResult;
    };
})();
</script>
`;
    
    // Check if the script is already added
    if (data.includes('_verifyAdminPassword')) {
        console.log('Multi-layer password protection is already added to the HTML file.');
    } else {
        // Insert the script tag before the closing </body> tag
        const updatedHtml = data.replace('</body>', `    ${scriptContent}\n</body>`);
        
        // Write the updated HTML back to the file
        fs.writeFile(htmlFilePath, updatedHtml, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file: ${err}`);
                process.exit(1);
            }
            console.log('Multi-layer password protection added to the HTML file.');
        });
    }
    
    // Create a minified version of all protection scripts
    try {
        // Ensure the src directory exists
        if (!fs.existsSync('src')) {
            fs.mkdirSync('src');
        }
        
        // Create a combined protection script
        const combinedScriptPath = 'src/combined-protection.js';
        const jsProtectionPath = 'src/password-protection.js';
        
        if (fs.existsSync(jsProtectionPath)) {
            const jsProtection = fs.readFileSync(jsProtectionPath, 'utf8');
            
            // Add some additional obfuscation
            const obfuscatedJs = `
// Combined password protection system
(function() {
    // Original protection code
    ${jsProtection}
    
    // Additional protection for the specific password: 0988131688
    const _0x1a2b = ['0', '9', '8', '8', '1', '3', '1', '6', '8', '8'];
    const _0x3c4d = [48, 57, 56, 56, 49, 51, 49, 54, 56, 56];
    
    // Override the verification function
    const originalVerifyPassword = window.checkPassword || function() { return false; };
    window.checkPassword = function(input) {
        // Convert input to array of characters
        const chars = input.split('');
        
        // Check each character against both arrays
        let isValid = chars.length === 10;
        if (isValid) {
            for (let i = 0; i < 10; i++) {
                if (chars[i] !== _0x1a2b[i] || chars[i].charCodeAt(0) !== _0x3c4d[i]) {
                    isValid = false;
                    break;
                }
            }
        }
        
        // Call the original function for additional verification
        return isValid && originalVerifyPassword(input);
    };
})();
`;
            
            fs.writeFileSync(combinedScriptPath, obfuscatedJs, 'utf8');
            console.log('Created combined protection script.');
            
            // Minify the combined script
            if (fs.existsSync('minify.js')) {
                console.log('Minifying combined protection script...');
                execSync(`node minify.js ${combinedScriptPath}`);
                
                // Obfuscate the minified script
                if (fs.existsSync('obfuscate.js')) {
                    console.log('Obfuscating combined protection script...');
                    execSync(`node obfuscate.js ${combinedScriptPath.replace('.js', '.min.js')}`);
                    
                    // Rename the final file
                    const finalPath = 'public/password-protection.min.js';
                    fs.renameSync(
                        combinedScriptPath.replace('.js', '.min.obfuscated.js'), 
                        finalPath
                    );
                    
                    console.log(`Final protection script saved to ${finalPath}`);
                }
            }
        } else {
            console.log('JavaScript protection file not found. Skipping combined script creation.');
        }
    } catch (error) {
        console.error(`Error processing protection scripts: ${error}`);
    }
    
    console.log('Multi-layer password protection integration complete.');
});
