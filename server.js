const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// Serves the premium CrystalFetch UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// The Enterprise API Engine
app.post('/api/extract', async (req, res) => {
    const { url } = req.body;
    console.log(`\n[+] Crystal Inc. Cloud Processing: ${url}`);

    if (!url) return res.status(400).json({ error: "No link provided." });

    try {
        // 🟢 THE BULLETPROOF BYPASS
        // Your private key guarantees access. No clusters, no blocks.
        const response = await fetch(`https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoUrl=${encodeURIComponent(url)}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'x-rapidapi-key: 0ada56a7famshab39e0805e997a5p1d0b50jsn14e53c6bc252"',
                'X-RapidAPI-Host': 'youtube-media-downloader.p.rapidapi.com' // Update this if you use a different API!
            }
        });

        const data = await response.json();

        // Adjust this line based on how the specific API you pick formats its JSON!
        const downloadUrl = data.videos?.items?.[0]?.url || data.url || data.link;

        if (downloadUrl) {
            console.log(`[SUCCESS] Bypassed security! Pushing file.`);
            return res.json({ downloadUrl: downloadUrl });
        } else {
            throw new Error("API couldn't find a valid media link.");
        }

    } catch (error) {
        console.log(`[-] Extraction failed: ${error.message}`);
        res.status(500).json({ error: "Private API request failed. Check API key." });
    }
});

app.listen(PORT, () => {
    console.log(`[🚀] CrystalFetch Enterprise Engine Active`);
});
