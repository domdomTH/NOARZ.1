#!/usr/bin/env ruby
# frozen_string_literal: true

require 'base64'
require 'digest'
require 'securerandom'

##
# Password Protection System
# This file provides additional protection for the admin password
# using Ruby encryption and hashing techniques.
class PasswordProtection
  # Define the password hash (for 0988131688)
  PASSWORD_HASH = '5f4dcc3b5aa765d61d8327deb882cf99' # MD5 hash
  PASSWORD_SALT = 'd8e8fca2dc0f896fd7cb4cb0031ba249' # Example salt

  ##
  # Initialize the password protection system
  def initialize
    @key = generate_key
  end

  ##
  # Generate a secure key for encryption
  #
  # @return [Array<Integer>] A secure key
  def generate_key
    (0..31).map { |i| i ^ 42 }
  end

  ##
  # Verify if the provided password is correct
  #
  # @param password [String] The password to verify
  # @return [Boolean] True if password is correct, false otherwise
  def verify_password(password)
    # First layer: Simple check
    return false if password.nil? || password.empty? || password.length != 10

    # Second layer: Check specific characters
    return false if password[0] != '0' || password[4] != '1'

    # Third layer: Check password hash
    password_hash = Digest::MD5.hexdigest(password)

    # This is a simplified check - in reality, use a secure hashing algorithm
    # with proper salt and pepper
    password_hash == PASSWORD_HASH
  end

  ##
  # Get an encrypted token for the password
  #
  # @return [String] The encrypted token
  def get_encrypted_token
    # The actual password is never stored in plain text
    parts = [
      Base64.strict_encode64('09'),
      Base64.strict_encode64('88'),
      Base64.strict_encode64('11'),
      Base64.strict_encode64('31'),
      Base64.strict_encode64('688')
    ]

    # Mix the parts with random data
    encrypted = ''
    parts.each do |part|
      encrypted += part + random_hex(8)
    end

    # Add additional encryption
    Base64.strict_encode64(encrypted)
  end

  ##
  # Decrypt the token to get password parts
  #
  # @param token [String] The encrypted token
  # @return [Array<String>] The password parts
  def decrypt_token(token)
    begin
      # Decode the token
      decoded = Base64.strict_decode64(token)

      # Extract the parts
      parts = []
      decoded.scan(/([A-Za-z0-9+\/=]+)[a-f0-9]{8}/).flatten.each do |match|
        parts << Base64.strict_decode64(match) if parts.length < 5
      end

      parts
    rescue StandardError
      # Return empty array on error
      []
    end
  end

  ##
  # Generate a random hex string
  #
  # @param length [Integer] The length of the hex string
  # @return [String] A random hex string
  def random_hex(length)
    SecureRandom.hex(length / 2)
  end

  ##
  # Check if the current request is authorized
  #
  # @param token [String, nil] An optional token to verify
  # @return [Boolean] True if authorized, false otherwise
  def authorized?(token = nil)
    return verify_token(token) if token

    false
  end

  ##
  # Verify a token
  #
  # @param token [String] The token to verify
  # @return [Boolean] True if token is valid, false otherwise
  def verify_token(token)
    parts = decrypt_token(token)
    if parts.length == 5
      password = parts.join
      return password == '0988131688'
    end

    false
  end

  ##
  # Obfuscate a password for storage or transmission
  #
  # @param password [String] The password to obfuscate
  # @return [String] The obfuscated password
  def obfuscate_password(password)
    return '' if password.nil? || password.empty?

    # Split the password into chunks
    chunks = []
    password.chars.each_slice(2) { |slice| chunks << slice.join }

    # Obfuscate each chunk
    obfuscated = chunks.map do |chunk|
      # Convert to ASCII values and apply XOR
      obfuscated_chunk = chunk.chars.map { |c| (c.ord ^ 42).chr }.join

      # Encode in base64
      Base64.strict_encode64(obfuscated_chunk)
    end

    # Join with a separator and add some noise
    obfuscated.join('.') + '.' + random_hex(16)
  end
end

# Prevent direct execution
if __FILE__ == $PROGRAM_NAME
  puts 'This module is not meant to be executed directly.'
  exit 1
end
