const express = require('express');
const cors = require('cors');
const { scanWebPage } = require('./index.js');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
    try {
        const { url, prompt } = req.body;
        const result = await scanWebPage(url, prompt);
        res.json({ success: true, result });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
