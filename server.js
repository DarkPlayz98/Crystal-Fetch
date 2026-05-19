const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// 🟢 YOUR PRIVATE KEY HARDCODED FOR INSTANT DEPLOYMENT
const RAPIDAPI_KEY = "0ada56a7famshab39e0805e997a5p1d0b50jsn14e53c6bc252";

app.use(express.json());

// Serves the premium CrystalFetch UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// The Enterprise API Routing Engine
app.post('/api/extract', async (req, res) => {
    const { url, format } = req.body;
    console.log(`\n[+] Crystal Inc. Enterprise Processing: ${url}`);
    console.log(`[+] Requested Format: ${format.toUpperCase()}`);

    if (!url) return res.status(400).json({ error: "No link provided." });

    try {
        // 1. Extract the 11-character Video ID from the YouTube URL
        const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*vi=|.*u\/\w\/|embed\/|v=))([^#\&\?]*).*/);
        const videoId = (videoIdMatch && videoIdMatch[1].length === 11) ? videoIdMatch[1] : null;

        if (!videoId) throw new Error("Please provide a valid YouTube link.");

        // 2. Hit the Enterprise YouTube Details API
        const response = await fetch(`https://youtube138.p.rapidapi.com/video/details/?id=${videoId}&hl=en&gl=US`, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'youtube138.p.rapidapi.com',
                'x-rapidapi-key': RAPIDAPI_KEY
            }
        });

        const data = await response.json();

        // Check if the API threw a rate-limit or invalid ID error
        if (!data || !data.streamingData) {
            console.log("[-] API Reject:", data);
            throw new Error("API limit reached or video is restricted/private.");
        }

        let downloadUrl = null;

        // 3. Intelligently dig through the streaming formats
        if (format === 'mp3') {
            // Filter for audio-only streams and grab the highest quality
            const audioFormats = data.streamingData.adaptiveFormats?.filter(f => f.mimeType && f.mimeType.includes('audio')) || [];
            if (audioFormats.length > 0) downloadUrl = audioFormats[0].url;
        } else {
            // Filter for standard mp4 video streams
            const videoFormats = data.streamingData.formats?.filter(f => f.mimeType && f.mimeType.includes('mp4')) || [];
            if (videoFormats.length > 0) {
                downloadUrl = videoFormats[0].url;
            } else if (data.streamingData.formats && data.streamingData.formats.length > 0) {
                downloadUrl = data.streamingData.formats[0].url; // Safe fallback
            }
        }

        // Final safety fallback
        if (!downloadUrl && data.url) downloadUrl = data.url; 

        if (downloadUrl) {
            console.log(`[SUCCESS] Bypassed security! Pushing enterprise file link.`);
            return res.json({ downloadUrl: downloadUrl });
        } else {
            throw new Error("API connected, but no download link was found in the media.");
        }

    } catch (error) {
        console.log(`[-] Extraction failed: ${error.message}`);
        res.status(500).json({ error: error.message || "Server connection failed." });
    }
});

app.listen(PORT, () => {
    console.log(`[🚀] CrystalFetch Enterprise Engine Active on Port ${PORT}`);
    console.log(`[+] Property of Crystal Inc.`);
});
