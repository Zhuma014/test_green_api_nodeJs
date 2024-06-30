const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/getSettings', async (req, res) => {
    await callApi(req, res, 'getSettings');
});

app.get('/getStateInstance', async (req, res) => {
    await callApi(req, res, 'getStateInstance');
});

app.post('/sendMessage', async (req, res) => {
    const { chatId, message } = req.body;
    if (!validateChatId(chatId)) {
        return res.status(400).json({ error: 'Invalid chatId format.' });
    }
    const body = { chatId, message };
    await callApi(req, res, 'sendMessage', 'POST', body);
});

app.post('/sendFileByUrl', async (req, res) => {
    const { chatId, urlFile } = req.body;
    if (!validateChatId(chatId)) {
        return res.status(400).json({ error: 'Invalid chatId format.' });
    }
    const body = {
        chatId,
        urlFile,
        fileName: urlFile.split('/').pop()
    };
    await callApi(req, res, 'sendFileByUrl', 'POST', body);
});

async function callApi(req, res, endpoint, method = 'GET', body = null) {
    const { idInstance, apiTokenInstance } = req.query;

    const url = `https://api.green-api.com/waInstance${idInstance}/${endpoint}/${apiTokenInstance}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        },

       
    };
    if (body) {
        options.data = body; 
      }

  

    try {
        const response = await axios(url, options);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function validateChatId(chatId) {
    const individualChatPattern = /^[0-9]{11,14}@c\.us$/;
    const groupChatPattern = /^[0-9-]+@g\.us$/;
    return individualChatPattern.test(chatId) || groupChatPattern.test(chatId);
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
