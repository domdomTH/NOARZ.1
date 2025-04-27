/**
 * Code Protection Module
 * This module provides various protections for your website code.
 */

// Self-executing anonymous function to create a private scope
(function() {
    // Anti-debugging measures
    function enableAntiDebugging() {
        // Detect and prevent debugging
        setInterval(function() {
            debugger;
        }, 100);
        
        // Detect DevTools
        const devToolsDetector = function() {
            const threshold = 160;
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            if (widthThreshold || heightThreshold) {
                document.body.innerHTML = '<div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;"><h1>Access Denied</h1><p>Developer tools are not allowed on this site.</p></div>';
            }
        };
        
        window.addEventListener('resize', devToolsDetector);
        setInterval(devToolsDetector, 1000);
        
        // Detect console opening
        const consoleCheck = new Image();
        Object.defineProperty(consoleCheck, 'id', {
            get: function() {
                document.body.innerHTML = '<div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;"><h1>Access Denied</h1><p>Developer tools are not allowed on this site.</p></div>';
            }
        });
        
        console.log('%c', consoleCheck);
    }
    
    // Disable right-click
    function disableRightClick() {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
    }
    
    // Disable keyboard shortcuts for developer tools
    function disableDevToolsShortcuts() {
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
    }
    
    // Disable text selection
    function disableSelection() {
        document.addEventListener('selectstart', function(e) {
            e.preventDefault();
            return false;
        });
    }
    
    // Disable drag and drop
    function disableDragDrop() {
        document.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });
    }
    
    // Disable view source
    function disableViewSource() {
        document.addEventListener('keydown', function(e) {
            // Ctrl+U
            if (e.ctrlKey && e.keyCode === 85) {
                e.preventDefault();
                return false;
            }
        });
    }
    
    // Disable save page
    function disableSavePage() {
        document.addEventListener('keydown', function(e) {
            // Ctrl+S
            if (e.ctrlKey && e.keyCode === 83) {
                e.preventDefault();
                return false;
            }
        });
    }
    
    // Disable print page
    function disablePrintPage() {
        document.addEventListener('keydown', function(e) {
            // Ctrl+P
            if (e.ctrlKey && e.keyCode === 80) {
                e.preventDefault();
                return false;
            }
        });
    }
    
    // Add a warning message to the console
    function addConsoleWarning() {
        const warningStyle = 'color: red; font-size: 30px; font-weight: bold; text-shadow: 1px 1px 2px black;';
        console.log('%cWARNING!', warningStyle);
        console.log('%cThis is a protected website. Using the developer console may expose you to security risks.', 'color: red; font-size: 16px;');
        console.log('%cIf someone told you to copy-paste something here, it is likely a scam.', 'color: red; font-size: 16px;');
    }
    
    // Obfuscate HTML source
    function obfuscateHTML() {
        // This function adds invisible characters and comments to make the HTML harder to read
        const htmlContent = document.documentElement.outerHTML;
        const obfuscatedHTML = htmlContent.replace(/<([^>]+)>/g, function(match) {
            // Add invisible zero-width characters between attributes
            return match.replace(/\s+/g, ' \u200B \u200C \u200D ');
        });
        
        document.open();
        document.write(obfuscatedHTML);
        document.close();
    }
    
    // Initialize all protections
    function initProtection() {
        enableAntiDebugging();
        disableRightClick();
        disableDevToolsShortcuts();
        disableSelection();
        disableDragDrop();
        disableViewSource();
        disableSavePage();
        disablePrintPage();
        addConsoleWarning();
        
        // Only run HTML obfuscation if explicitly enabled
        // obfuscateHTML(); // Uncomment to enable
        
        console.log('Code protection initialized');
    }
    
    // Export the initialization function to the global scope
    window.initCodeProtection = initProtection;
    
    // Auto-initialize if the data-auto-protect attribute is present
    if (document.currentScript && document.currentScript.getAttribute('data-auto-protect') === 'true') {
        // Initialize protection when the DOM is fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initProtection);
        } else {
            initProtection();
        }
    }
})();
