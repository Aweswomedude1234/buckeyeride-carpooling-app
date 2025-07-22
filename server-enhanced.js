// Enhanced HTTP server for local development with better error handling
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'font/eot'
};

// Enhanced file serving with better error handling
function serveFile(res, filePath, contentType) {
    try {
        if (!fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
            return;
        }

        const stats = fs.statSync(filePath);
        if (!stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
            return;
        }

        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
        
        stream.on('error', (err) => {
            console.error('Error serving file:', err);
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 Internal Server Error</h1>');
            }
        });
    } catch (error) {
        console.error('Error in serveFile:', error);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 Internal Server Error</h1>');
    }
}

// Create server with enhanced error handling
const server = http.createServer((req, res) => {
    try {
        // Parse URL
        const parsedUrl = url.parse(req.url, true);
        let pathname = parsedUrl.pathname;
        
        // Handle CORS preflight requests
        if (req.method === 'OPTIONS') {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            });
            res.end();
            return;
        }
        
        // Default to index.html
        if (pathname === '/' || pathname === '') {
            pathname = '/index.html';
        }
        
        // Remove trailing slash
        pathname = pathname.replace(/\/+$/, '');
        
        // Handle dashboard routes
        if (pathname.startsWith('/dashboard')) {
            const dashboardPath = pathname.substring(1) + '.html';
            const filePath = path.join(__dirname, dashboardPath);
            
            if (fs.existsSync(filePath)) {
                serveFile(res, filePath, 'text/html');
                return;
            }
        }
        
        // Construct file path
        let filePath = path.join(__dirname, pathname);
        
        // Security check - prevent directory traversal
        const resolvedPath = path.resolve(filePath);
        if (!resolvedPath.startsWith(path.resolve(__dirname))) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('403 Forbidden');
            return;
        }
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            // Try with .html extension
            const htmlPath = filePath + '.html';
            if (fs.existsSync(htmlPath)) {
                serveFile(res, htmlPath, 'text/html');
                return;
            }
            
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1><p>The requested page could not be found.</p>');
            return;
        }
        
        // Get file extension and content type
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'text/plain';
        
        serveFile(res, filePath, contentType);
        
    } catch (error) {
        console.error('Server error:', error);
        if (!res.headersSent) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('<h1>500 Internal Server Error</h1>');
        }
    }
});

// Handle server errors
server.on('clientError', (err, socket) => {
    console.error('Client error:', err);
    if (socket.writable) {
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    }
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 BuckeyeRide server running at:`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`   http://127.0.0.1:${PORT}`);
    console.log(`   http://0.0.0.0:${PORT}`);
    console.log('\nPress Ctrl+C to stop the server');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => {
        console.log('Server stopped gracefully');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
