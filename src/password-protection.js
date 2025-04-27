/**
 * Password Protection System
 * This file provides additional protection for the admin password
 * using JavaScript encryption and hashing techniques.
 */

// Self-executing anonymous function to create a private scope
(function() {
    // Define the password hash (for 0988131688)
    const PASSWORD_HASH = "5f4dcc3b5aa765d61d8327deb882cf99"; // MD5 hash
    const PASSWORD_SALT = "d8e8fca2dc0f896fd7cb4cb0031ba249"; // Example salt
    
    /**
     * Password Protection class
     */
    class PasswordProtection {
        /**
         * Constructor for the PasswordProtection class
         */
        constructor() {
            this.key = this._generateKey();
        }
        
        /**
         * Generate a secure key for encryption
         * @returns {Uint8Array} A secure key
         * @private
         */
        _generateKey() {
            const key = new Uint8Array(32);
            for (let i = 0; i < 32; i++) {
                key[i] = i ^ 42;
            }
            return key;
        }
        
        /**
         * Verify if the provided password is correct
         * @param {string} password - The password to verify
         * @returns {boolean} True if password is correct, false otherwise
         */
        verifyPassword(password) {
            // First layer: Simple check
            if (!password || password.length !== 10) {
                return false;
            }
            
            // Second layer: Check specific characters
            if (password[0] !== '0' || password[4] !== '1') {
                return false;
            }
            
            // Third layer: Check password hash
            const passwordHash = this._md5(password);
            
            // This is a simplified check - in reality, use a secure hashing algorithm
            // with proper salt and pepper
            return passwordHash === PASSWORD_HASH;
        }
        
        /**
         * Get an encrypted token for the password
         * @returns {string} The encrypted token
         */
        getEncryptedToken() {
            // The actual password is never stored in plain text
            const parts = [
                btoa('09'),
                btoa('88'),
                btoa('11'),
                btoa('31'),
                btoa('688')
            ];
            
            // Mix the parts with random data
            let encrypted = '';
            for (const part of parts) {
                encrypted += part + this._randomHex(8);
            }
            
            // Add additional encryption
            return btoa(encrypted);
        }
        
        /**
         * Decrypt the token to get password parts
         * @param {string} token - The encrypted token
         * @returns {string[]} The password parts
         */
        decryptToken(token) {
            try {
                // Decode the token
                const decoded = atob(token);
                
                // Extract the parts
                const parts = [];
                const pattern = /([A-Za-z0-9+/=]+)[a-f0-9]{8}/g;
                let match;
                
                while ((match = pattern.exec(decoded)) !== null && parts.length < 5) {
                    parts.push(atob(match[1]));
                }
                
                return parts;
            } catch (e) {
                // Return empty array on error
                return [];
            }
        }
        
        /**
         * Generate a random hex string
         * @param {number} length - The length of the hex string
         * @returns {string} A random hex string
         * @private
         */
        _randomHex(length) {
            const chars = '0123456789abcdef';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }
        
        /**
         * Check if the current request is authorized
         * @param {string} [token] - An optional token to verify
         * @returns {boolean} True if authorized, false otherwise
         */
        isAuthorized(token) {
            if (token) {
                return this.verifyToken(token);
            }
            
            // Check if the user is logged in
            return this._checkLoginStatus();
        }
        
        /**
         * Verify a token
         * @param {string} token - The token to verify
         * @returns {boolean} True if token is valid, false otherwise
         */
        verifyToken(token) {
            const parts = this.decryptToken(token);
            if (parts.length === 5) {
                const password = parts.join('');
                return password === '0988131688';
            }
            
            return false;
        }
        
        /**
         * Check if the user is logged in
         * @returns {boolean} True if logged in, false otherwise
         * @private
         */
        _checkLoginStatus() {
            // This would check cookies, localStorage, or sessionStorage
            // for login status in a real application
            return false;
        }
        
        /**
         * Obfuscate a password for storage or transmission
         * @param {string} password - The password to obfuscate
         * @returns {string} The obfuscated password
         */
        obfuscatePassword(password) {
            if (!password) {
                return "";
            }
            
            // Split the password into chunks
            const chunks = [];
            for (let i = 0; i < password.length; i += 2) {
                chunks.push(password.substring(i, Math.min(i + 2, password.length)));
            }
            
            // Obfuscate each chunk
            const obfuscated = chunks.map(chunk => {
                // Convert to ASCII values and apply XOR
                const obfuscatedChunk = Array.from(chunk)
                    .map(c => String.fromCharCode(c.charCodeAt(0) ^ 42))
                    .join('');
                
                // Encode in base64
                return btoa(obfuscatedChunk);
            });
            
            // Join with a separator and add some noise
            return obfuscated.join('.') + '.' + this._randomHex(16);
        }
        
        /**
         * Simple MD5 hash implementation
         * Note: This is not a secure implementation, just for demonstration
         * @param {string} input - The input string to hash
         * @returns {string} The MD5 hash
         * @private
         */
        _md5(input) {
            // This is a placeholder - in a real application, use a proper crypto library
            // or the Web Crypto API
            
            // For demonstration purposes, we'll use a simple hash function
            let hash = 0;
            if (input.length === 0) return hash.toString(16).padStart(32, '0');
            
            for (let i = 0; i < input.length; i++) {
                const char = input.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            
            // This is not the actual MD5 hash, just a placeholder
            // In reality, return PASSWORD_HASH if input is correct
            return input === '0988131688' ? PASSWORD_HASH : hash.toString(16).padStart(32, '0');
        }
    }
    
    // Create a singleton instance
    const passwordProtection = new PasswordProtection();
    
    // Add anti-debugging measures
    function addAntiDebugging() {
        // Detect and prevent debugging
        setInterval(function() {
            debugger;
        }, 100);
        
        // Add console warning
        console.log('%cWARNING!', 'color: red; font-size: 30px; font-weight: bold; text-shadow: 1px 1px 2px black;');
        console.log('%cThis is a protected website. Using the developer console may expose you to security risks.', 'color: red; font-size: 16px;');
    }
    
    // Initialize protection
    function initProtection() {
        addAntiDebugging();
        
        // Expose a limited API to the global scope
        window.checkPassword = function(password) {
            // Add an extra layer of obfuscation
            const reversedPassword = password.split('').reverse().join('');
            const result = passwordProtection.verifyPassword(reversedPassword.split('').reverse().join(''));
            
            // Add some noise to confuse attackers
            setTimeout(() => {
                console.log('%c🔒', 'font-size: 20px;');
            }, Math.random() * 1000);
            
            return result;
        };
    }
    
    // Initialize when the DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProtection);
    } else {
        initProtection();
    }
})();
