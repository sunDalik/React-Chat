const utils = require('./utils.js');
const express = require('express');
const app = express();
const port = 8000;
const server = app.listen(port, () => {
    console.log(`Node.js server listening at http://localhost:${port}`);
});

const io = require('socket.io')(server, {
    transports: ["websocket"]
});

const chats = [];
const MAX_PARTICIPANTS = 2;

io.on('connection', (socket) => {
    console.log('New client connected');
    let socketChat = null;

    socket.on('join-chat', (url, responseCallback) => {
        if (socketChat) {
            utils.removeObjectFromArray(socket, socketChat);
        }
        const newChat = chats.find(c => c.url === url);
        if (!newChat) {
            responseCallback(null);
        }
        if (newChat.sockets.length < MAX_PARTICIPANTS) {
            socketChat = newChat;
            socketChat.sockets.push(socket);
            responseCallback(true);
            socket.emit('new-messages', socketChat.messages);
        } else {
            responseCallback(false);
        }
    });

    socket.on('new-chat', (responseCallback) => {
        try {
            const chat = generateNewChat();
            responseCallback(chat.url);
        } catch (e) {
            responseCallback("");
        }
    });

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

        if (chats.every(c => c.url !== url)) {
            const newChat = {url: url, messages: [], sockets: []};
            chats.push(newChat);

            return newChat;
        }
    }
    throw new Error();
}