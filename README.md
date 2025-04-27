# Code Protection System

This system provides multiple layers of protection for your website code to prevent unauthorized users from viewing or copying your source code.

## Features

- **JavaScript Obfuscation**: Makes your JavaScript code difficult to read and understand
- **Code Minification**: Removes whitespace, comments, and shortens variable names
- **Anti-Debugging Measures**: Prevents users from using browser developer tools
- **Right-Click Protection**: Disables right-click context menu
- **View Source Protection**: Blocks keyboard shortcuts for viewing source code
- **Server-Side Authentication**: Requires login to access sensitive code
- **Console Warning**: Displays warning messages in the browser console

## Installation

1. Make sure you have Node.js installed on your system
2. Clone this repository to your local machine
3. Install the required dependencies:

```bash
npm install express express-session
```

## Usage

### 1. Integrate Code Protection

Run the integration script to add code protection to your website:

```bash
node integrate-protection.js
```

This will:
- Add the code protection script to your HTML file
- Minify and obfuscate the code protection script
- Create necessary directories for the server

### 2. Obfuscate Your JavaScript Files

To obfuscate a JavaScript file:

```bash
node obfuscate.js path/to/your/file.js
```

This will create an obfuscated version of your file at `path/to/your/file.obfuscated.js`.

### 3. Minify Your JavaScript Files

To minify a JavaScript file:

```bash
node minify.js path/to/your/file.js
```

This will create a minified version of your file at `path/to/your/file.min.js`.

### 4. Run the Server

Start the authentication server:

```bash
node server.js
```

The server will run at http://localhost:3000 by default.

## Admin Access

To access the admin area and protected source code:

1. Navigate to http://localhost:3000/login
2. Login with the following credentials:
   - Username: admin
   - Password: DomDom09881131688

## Customization

### Change Admin Credentials

Edit the `server.js` file to change the admin credentials:

```javascript
const adminCredentials = {
    username: 'your-username',
    passwordHash: 'your-password-hash' // Use MD5 hash for demo, bcrypt in production
};
```

### Adjust Protection Level

Edit the `code-protection.js` file to enable or disable specific protection features:

```javascript
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
    
    // Uncomment to enable HTML obfuscation
    // obfuscateHTML();
}
```

## Security Notes

1. This system provides basic protection but is not foolproof. Determined users may still find ways to access your code.
2. For production use, consider additional security measures such as:
   - Using HTTPS
   - Implementing rate limiting
   - Using a more secure password hashing algorithm (bcrypt)
   - Storing credentials in a secure database
   - Adding CSRF protection

## License

This code is provided for educational purposes only. Use at your own risk.
