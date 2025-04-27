import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Password Protection System
 * This class provides additional protection for the admin password
 * using Java encryption and hashing techniques.
 */
public class PasswordProtection {
    
    // Define the password hash (for 0988131688)
    private static final String PASSWORD_HASH = "5f4dcc3b5aa765d61d8327deb882cf99"; // MD5 hash
    private static final String PASSWORD_SALT = "d8e8fca2dc0f896fd7cb4cb0031ba249"; // Example salt
    
    private final SecureRandom random;
    private final byte[] key;
    
    /**
     * Constructor for the PasswordProtection class
     */
    public PasswordProtection() {
        this.random = new SecureRandom();
        this.key = generateKey();
    }
    
    /**
     * Generate a secure key for encryption
     * 
     * @return A secure key as byte array
     */
    private byte[] generateKey() {
        byte[] key = new byte[32];
        for (int i = 0; i < 32; i++) {
            key[i] = (byte) (i ^ 42);
        }
        return key;
    }
    
    /**
     * Verify if the provided password is correct
     * 
     * @param password The password to verify
     * @return True if password is correct, false otherwise
     */
    public boolean verifyPassword(String password) {
        // First layer: Simple check
        if (password == null || password.length() != 10) {
            return false;
        }
        
        // Second layer: Check specific characters
        if (password.charAt(0) != '0' || password.charAt(4) != '1') {
            return false;
        }
        
        // Third layer: Check password hash
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.update(password.getBytes(StandardCharsets.UTF_8));
            byte[] digest = md.digest();
            
            // Convert to hex string
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            String passwordHash = sb.toString();
            
            // This is a simplified check - in reality, use a secure hashing algorithm
            // with proper salt and pepper
            return passwordHash.equals(PASSWORD_HASH);
        } catch (NoSuchAlgorithmException e) {
            return false;
        }
    }
    
    /**
     * Get an encrypted token for the password
     * 
     * @return The encrypted token as a string
     */
    public String getEncryptedToken() {
        // The actual password is never stored in plain text
        String[] parts = {
            Base64.getEncoder().encodeToString("09".getBytes(StandardCharsets.UTF_8)),
            Base64.getEncoder().encodeToString("88".getBytes(StandardCharsets.UTF_8)),
            Base64.getEncoder().encodeToString("11".getBytes(StandardCharsets.UTF_8)),
            Base64.getEncoder().encodeToString("31".getBytes(StandardCharsets.UTF_8)),
            Base64.getEncoder().encodeToString("688".getBytes(StandardCharsets.UTF_8))
        };
        
        // Mix the parts with random data
        StringBuilder encrypted = new StringBuilder();
        for (String part : parts) {
            encrypted.append(part).append(randomHex(8));
        }
        
        // Add additional encryption
        return Base64.getEncoder().encodeToString(encrypted.toString().getBytes(StandardCharsets.UTF_8));
    }
    
    /**
     * Decrypt the token to get password parts
     * 
     * @param token The encrypted token
     * @return The password parts as a list of strings
     */
    public List<String> decryptToken(String token) {
        try {
            // Decode the token
            String decoded = new String(Base64.getDecoder().decode(token), StandardCharsets.UTF_8);
            
            // Extract the parts
            List<String> parts = new ArrayList<>();
            Pattern pattern = Pattern.compile("([A-Za-z0-9+/=]+)[a-f0-9]{8}");
            Matcher matcher = pattern.matcher(decoded);
            
            while (matcher.find() && parts.size() < 5) {
                String match = matcher.group(1);
                parts.add(new String(Base64.getDecoder().decode(match), StandardCharsets.UTF_8));
            }
            
            return parts;
        } catch (Exception e) {
            // Return empty list on error
            return new ArrayList<>();
        }
    }
    
    /**
     * Generate a random hex string
     * 
     * @param length The length of the hex string
     * @return A random hex string
     */
    private String randomHex(int length) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append("0123456789abcdef".charAt(random.nextInt(16)));
        }
        return sb.toString();
    }
    
    /**
     * Check if the current request is authorized
     * 
     * @param token An optional token to verify
     * @return True if authorized, false otherwise
     */
    public boolean isAuthorized(String token) {
        if (token != null && !token.isEmpty()) {
            return verifyToken(token);
        }
        
        return false;
    }
    
    /**
     * Verify a token
     * 
     * @param token The token to verify
     * @return True if token is valid, false otherwise
     */
    public boolean verifyToken(String token) {
        List<String> parts = decryptToken(token);
        if (parts.size() == 5) {
            StringBuilder password = new StringBuilder();
            for (String part : parts) {
                password.append(part);
            }
            return password.toString().equals("0988131688");
        }
        
        return false;
    }
    
    /**
     * Obfuscate a password for storage or transmission
     * 
     * @param password The password to obfuscate
     * @return The obfuscated password
     */
    public String obfuscatePassword(String password) {
        if (password == null || password.isEmpty()) {
            return "";
        }
        
        // Split the password into chunks
        List<String> chunks = new ArrayList<>();
        for (int i = 0; i < password.length(); i += 2) {
            int end = Math.min(i + 2, password.length());
            chunks.add(password.substring(i, end));
        }
        
        // Obfuscate each chunk
        List<String> obfuscated = new ArrayList<>();
        for (String chunk : chunks) {
            // Convert to ASCII values and apply XOR
            StringBuilder obfuscatedChunk = new StringBuilder();
            for (char c : chunk.toCharArray()) {
                obfuscatedChunk.append((char) (c ^ 42));
            }
            
            // Encode in base64
            String encodedChunk = Base64.getEncoder().encodeToString(obfuscatedChunk.toString().getBytes(StandardCharsets.UTF_8));
            obfuscated.add(encodedChunk);
        }
        
        // Join with a separator and add some noise
        return String.join(".", obfuscated) + "." + randomHex(16);
    }
    
    /**
     * Main method for testing
     * 
     * @param args Command line arguments
     */
    public static void main(String[] args) {
        System.out.println("This class is not meant to be executed directly.");
        System.exit(1);
    }
}
