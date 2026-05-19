const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// Serves the premium CrystalFetch UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// The Cloud API Routing Engine
app.post('/api/extract', async (req, res) => {
    const { url, format } = req.body;
    console.log(`\n[+] Crystal Inc. Cloud Processing: ${url}`);

    if (!url) return res.status(400).json({ error: "No link provided." });

    try {
        // 🟢 THE GOD-MODE BYPASS: Outsourcing to the Cobalt Open API
        // This completely dodges Render's IP ban because Cobalt's servers fetch the file for you.
        const cobaltResponse = await fetch('https://api.cobalt.tools/api/json', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' // Pretend to be a Windows PC
            },
            body: JSON.stringify({
                url: url,
                isAudioOnly: format === 'mp3'
            })
        });

        const data = await cobaltResponse.json();

        if (data && data.url) {
            console.log(`[SUCCESS] Bypassed YouTube security! Pushing file.`);
            return res.json({ downloadUrl: data.url });
        } else {
            console.log(`[-] API Blocked:`, data);
            throw new Error("The media might be private or region-locked.");
        }

    } catch (error) {
        console.log(`[-] Extraction failed: ${error.message}`);
        res.status(500).json({ error: "Bypass failed. The post is heavily protected." });
    }
});

app.listen(PORT, () => {
    console.log(`[🚀] CrystalFetch Cloud Engine Active on Port ${PORT}`);
    console.log(`[+] Property of Crystal Inc.`);
});
