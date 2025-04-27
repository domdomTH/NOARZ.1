/**
 * Script to integrate code protection into the website
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
    
    // Add the code protection script to the HTML
    const scriptTag = '<script src="code-protection.min.js" data-auto-protect="true"></script>';
    
    // Check if the script is already added
    if (data.includes('code-protection.min.js')) {
        console.log('Code protection script is already added to the HTML file.');
    } else {
        // Insert the script tag before the closing </body> tag
        const updatedHtml = data.replace('</body>', `    ${scriptTag}\n</body>`);
        
        // Write the updated HTML back to the file
        fs.writeFile(htmlFilePath, updatedHtml, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file: ${err}`);
                process.exit(1);
            }
            console.log('Code protection script added to the HTML file.');
        });
    }
    
    // Minify and obfuscate the code protection script
    try {
        console.log('Minifying code protection script...');
        execSync('node minify.js code-protection.js');
        
        console.log('Obfuscating code protection script...');
        execSync('node obfuscate.js code-protection.min.js');
        
        // Rename the obfuscated file
        fs.renameSync(
            'code-protection.min.obfuscated.js', 
            'public/code-protection.min.js'
        );
        
        console.log('Code protection script processed successfully.');
    } catch (error) {
        console.error(`Error processing code protection script: ${error}`);
    }
    
    // Create necessary directories
    const directories = ['public', 'private', 'src'];
    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            console.log(`Created directory: ${dir}`);
        }
    });
    
    console.log('Code protection integration complete.');
});
