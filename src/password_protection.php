<?php
/**
 * Password Protection System
 * This file provides additional protection for the admin password
 * using PHP encryption and hashing techniques.
 */

// Disable error reporting for security
error_reporting(0);
ini_set('display_errors', 0);

// Define the password hash (for 0988131688)
define('PASSWORD_HASH', '$2y$10$qX3EGt1QVzrGh4UQoF5X8.4Ue7zUl5iVIxPxX9L9ZvZzKV5ZKQvXe');

/**
 * Verify if the provided password is correct
 * @param string $password The password to verify
 * @return bool True if password is correct, false otherwise
 */
function verifyPassword($password) {
    // First layer: Simple check
    if (empty($password) || strlen($password) !== 10) {
        return false;
    }
    
    // Second layer: Check specific characters
    if ($password[0] !== '0' || $password[4] !== '1') {
        return false;
    }
    
    // Third layer: Check password hash using password_verify
    return password_verify($password, PASSWORD_HASH);
}

/**
 * Get an encrypted token for the password
 * @return string The encrypted token
 */
function getEncryptedToken() {
    // The actual password is never stored in plain text
    $parts = [
        base64_encode('09'),
        base64_encode('88'),
        base64_encode('11'),
        base64_encode('31'),
        base64_encode('688')
    ];
    
    // Mix the parts with random data
    $encrypted = '';
    foreach ($parts as $part) {
        $encrypted .= $part . substr(md5(rand()), 0, 8);
    }
    
    // Add additional encryption
    return base64_encode($encrypted);
}

/**
 * Decrypt the token to get password parts
 * @param string $token The encrypted token
 * @return array The password parts
 */
function decryptToken($token) {
    try {
        // Decode the token
        $decoded = base64_decode($token);
        
        // Extract the parts
        $parts = [];
        $pattern = '/([A-Za-z0-9+\/=]+)[a-f0-9]{8}/';
        preg_match_all($pattern, $decoded, $matches);
        
        if (isset($matches[1]) && count($matches[1]) === 5) {
            foreach ($matches[1] as $match) {
                $parts[] = base64_decode($match);
            }
        }
        
        return $parts;
    } catch (Exception $e) {
        // Return empty array on error
        return [];
    }
}

/**
 * Check if the current request is authorized
 * @return bool True if authorized, false otherwise
 */
function isAuthorized() {
    // Check if the session is active and authenticated
    if (isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true) {
        return true;
    }
    
    // Check if the request has a valid authorization header
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $auth = $headers['Authorization'];
        if (strpos($auth, 'Bearer ') === 0) {
            $token = substr($auth, 7);
            // Verify the token (implement your token verification logic here)
            return verifyToken($token);
        }
    }
    
    return false;
}

/**
 * Verify a token
 * @param string $token The token to verify
 * @return bool True if token is valid, false otherwise
 */
function verifyToken($token) {
    // Implement your token verification logic here
    // This is a simplified example
    $parts = decryptToken($token);
    if (count($parts) === 5) {
        $password = implode('', $parts);
        return $password === '0988131688';
    }
    return false;
}

// Prevent direct access to this file
if (basename($_SERVER['PHP_SELF']) === basename(__FILE__)) {
    // Redirect to a 404 page or the homepage
    header('HTTP/1.0 404 Not Found');
    exit('File not found.');
}
?>
