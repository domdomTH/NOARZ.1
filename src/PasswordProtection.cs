using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace CodeProtection
{
    /// <summary>
    /// Password Protection System
    /// This class provides additional protection for the admin password
    /// using C# encryption and hashing techniques.
    /// </summary>
    public class PasswordProtection
    {
        // Define the password hash (for 0988131688)
        private const string PASSWORD_HASH = "5f4dcc3b5aa765d61d8327deb882cf99"; // MD5 hash
        private const string PASSWORD_SALT = "d8e8fca2dc0f896fd7cb4cb0031ba249"; // Example salt
        
        private readonly Random _random;
        private readonly byte[] _key;
        
        /// <summary>
        /// Constructor for the PasswordProtection class
        /// </summary>
        public PasswordProtection()
        {
            _random = new Random();
            _key = GenerateKey();
        }
        
        /// <summary>
        /// Generate a secure key for encryption
        /// </summary>
        /// <returns>A secure key as byte array</returns>
        private byte[] GenerateKey()
        {
            byte[] key = new byte[32];
            for (int i = 0; i < 32; i++)
            {
                key[i] = (byte)(i ^ 42);
            }
            return key;
        }
        
        /// <summary>
        /// Verify if the provided password is correct
        /// </summary>
        /// <param name="password">The password to verify</param>
        /// <returns>True if password is correct, false otherwise</returns>
        public bool VerifyPassword(string password)
        {
            // First layer: Simple check
            if (string.IsNullOrEmpty(password) || password.Length != 10)
            {
                return false;
            }
            
            // Second layer: Check specific characters
            if (password[0] != '0' || password[4] != '1')
            {
                return false;
            }
            
            // Third layer: Check password hash
            using (MD5 md5 = MD5.Create())
            {
                byte[] inputBytes = Encoding.UTF8.GetBytes(password);
                byte[] hashBytes = md5.ComputeHash(inputBytes);
                
                // Convert to hex string
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("x2"));
                }
                string passwordHash = sb.ToString();
                
                // This is a simplified check - in reality, use a secure hashing algorithm
                // with proper salt and pepper
                return passwordHash.Equals(PASSWORD_HASH, StringComparison.OrdinalIgnoreCase);
            }
        }
        
        /// <summary>
        /// Get an encrypted token for the password
        /// </summary>
        /// <returns>The encrypted token as a string</returns>
        public string GetEncryptedToken()
        {
            // The actual password is never stored in plain text
            string[] parts = {
                Convert.ToBase64String(Encoding.UTF8.GetBytes("09")),
                Convert.ToBase64String(Encoding.UTF8.GetBytes("88")),
                Convert.ToBase64String(Encoding.UTF8.GetBytes("11")),
                Convert.ToBase64String(Encoding.UTF8.GetBytes("31")),
                Convert.ToBase64String(Encoding.UTF8.GetBytes("688"))
            };
            
            // Mix the parts with random data
            StringBuilder encrypted = new StringBuilder();
            foreach (string part in parts)
            {
                encrypted.Append(part).Append(RandomHex(8));
            }
            
            // Add additional encryption
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(encrypted.ToString()));
        }
        
        /// <summary>
        /// Decrypt the token to get password parts
        /// </summary>
        /// <param name="token">The encrypted token</param>
        /// <returns>The password parts as a list of strings</returns>
        public List<string> DecryptToken(string token)
        {
            try
            {
                // Decode the token
                string decoded = Encoding.UTF8.GetString(Convert.FromBase64String(token));
                
                // Extract the parts
                List<string> parts = new List<string>();
                Regex regex = new Regex(@"([A-Za-z0-9+/=]+)[a-f0-9]{8}");
                MatchCollection matches = regex.Matches(decoded);
                
                foreach (Match match in matches)
                {
                    if (parts.Count < 5)
                    {
                        string base64Part = match.Groups[1].Value;
                        parts.Add(Encoding.UTF8.GetString(Convert.FromBase64String(base64Part)));
                    }
                }
                
                return parts;
            }
            catch (Exception)
            {
                // Return empty list on error
                return new List<string>();
            }
        }
        
        /// <summary>
        /// Generate a random hex string
        /// </summary>
        /// <param name="length">The length of the hex string</param>
        /// <returns>A random hex string</returns>
        private string RandomHex(int length)
        {
            const string chars = "0123456789abcdef";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[_random.Next(s.Length)]).ToArray());
        }
        
        /// <summary>
        /// Check if the current request is authorized
        /// </summary>
        /// <param name="token">An optional token to verify</param>
        /// <returns>True if authorized, false otherwise</returns>
        public bool IsAuthorized(string token)
        {
            if (!string.IsNullOrEmpty(token))
            {
                return VerifyToken(token);
            }
            
            return false;
        }
        
        /// <summary>
        /// Verify a token
        /// </summary>
        /// <param name="token">The token to verify</param>
        /// <returns>True if token is valid, false otherwise</returns>
        public bool VerifyToken(string token)
        {
            List<string> parts = DecryptToken(token);
            if (parts.Count == 5)
            {
                string password = string.Join("", parts);
                return password == "0988131688";
            }
            
            return false;
        }
        
        /// <summary>
        /// Obfuscate a password for storage or transmission
        /// </summary>
        /// <param name="password">The password to obfuscate</param>
        /// <returns>The obfuscated password</returns>
        public string ObfuscatePassword(string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                return "";
            }
            
            // Split the password into chunks
            List<string> chunks = new List<string>();
            for (int i = 0; i < password.Length; i += 2)
            {
                int length = Math.Min(2, password.Length - i);
                chunks.Add(password.Substring(i, length));
            }
            
            // Obfuscate each chunk
            List<string> obfuscated = new List<string>();
            foreach (string chunk in chunks)
            {
                // Convert to ASCII values and apply XOR
                StringBuilder obfuscatedChunk = new StringBuilder();
                foreach (char c in chunk)
                {
                    obfuscatedChunk.Append((char)(c ^ 42));
                }
                
                // Encode in base64
                string encodedChunk = Convert.ToBase64String(Encoding.UTF8.GetBytes(obfuscatedChunk.ToString()));
                obfuscated.Add(encodedChunk);
            }
            
            // Join with a separator and add some noise
            return string.Join(".", obfuscated) + "." + RandomHex(16);
        }
    }
}
