const express = require('express');
const path = require('path');
const app = express();

// Get port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle all routes by serving the appropriate HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle 404s by redirecting to home page
app.get('*', (req, res) => {
    // Check if the requested file exists
    const requestedFile = path.join(__dirname, req.path);
    
    // If it's an HTML file request, try to serve it
    if (req.path.endsWith('.html')) {
        res.sendFile(requestedFile, (err) => {
            if (err) {
                res.redirect('/');
            }
        });
    } else {
        // For other files, try to serve them directly
        res.sendFile(requestedFile, (err) => {
            if (err) {
                res.status(404).send('File not found');
            }
        });
    }
});

app.listen(PORT, () => {
    console.log(`Expandia website is running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
}); 