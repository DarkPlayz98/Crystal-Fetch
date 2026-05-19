const express = require('express');
const path = require('path');
const youtubedl = require('youtube-dl-exec');

const app = express();
// Cloud providers like Render use the process.env.PORT automatically
const PORT = process.env.PORT || 10000;

app.use(express.json());

// Serves the premium CrystalFetch UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// The Cloud Extraction Engine
app.post('/api/extract', async (req, res) => {
    const { url, format } = req.body;
    console.log(`\n[+] Crystal Inc. Cloud Processing: ${url}`);

    if (!url) return res.status(400).json({ error: "No link provided." });

    try {
        // Runs the extractor natively inside the cloud environment
        const rawUrl = await youtubedl(url, {
            getUrl: true,
            format: format === 'mp3' ? 'bestaudio' : 'b',
            noWarnings: true,
            preferFreeFormats: true
        });
        
        if (rawUrl) {
            console.log(`[SUCCESS] File located! Pushing to frontend.`);
            return res.json({ downloadUrl: rawUrl });
        } else {
            throw new Error("Extractor ran but returned no URL.");
        }

    } catch (error) {
        console.log(`[-] Extraction failed: ${error.message}`);
        res.status(500).json({ error: "Engine failed. The post might be private, unsupported, or region-locked." });
    }
});

app.listen(PORT, () => {
    console.log(`[🚀] CrystalFetch Cloud Engine Active on Port ${PORT}`);
    console.log(`[+] Property of Crystal Inc.`);
});
