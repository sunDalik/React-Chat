const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 8000;
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const currentChats = [];

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/chat/*', (req, res) => {
    const chatUrl = req.path.slice(6);
    res.send();
});

app.get('/newChat', (req, res) => {
    try {
        const chat = generateNewChat();
        res.send(chat.url);
    } catch (e) {
        res.status(500).send(e);
    }
});

app.listen(port, () => {
    console.log(`Node.js server listening at http://localhost:${port}`);
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

function generateNewChat() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let attempt = 0;
    while (attempt++ < 9999) {
        let url = "";
        for (let i = 0; i < 4; i++) {
            url += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }

        if (currentChats.every(c => c.url !== url)) {
            const newChat = {url: url, messages: []};
            currentChats.push(newChat);

            return newChat;
        }
    }
    throw "No free chat rooms available. Please try again later.";
}