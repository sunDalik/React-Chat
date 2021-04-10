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
        console.log("trying to join a chat " + url);
        if (socketChat) {
            utils.removeObjectFromArray(socket, socketChat.sockets);
        }
        const newChat = chats.find(c => c.url === url);
        if (!newChat) {
            console.log("Chat " + url + " not found");
            responseCallback(null);
        } else if (newChat.sockets.length < MAX_PARTICIPANTS) {
            socketChat = newChat;
            console.log("connected to " + socketChat.url);
            socketChat.sockets.push(socket);
            responseCallback(true);
            socket.emit('new-messages', newChat.messages);
        } else {
            console.log("Chat " + newChat.url + " is full");
            responseCallback(false);
        }
    });

    socket.on('new-chat', (responseCallback) => {
        try {
            const newChat = generateNewChat();
            socketChat = newChat;
            newChat.sockets.push(socket);
            responseCallback(newChat.url);
        } catch (e) {
            responseCallback("");
        }
    });

    socket.on('new-messages', (message) => {
        console.log("Got new message");
        if (socketChat) {
            console.log("Pushed new message to " + socketChat.url);
            socketChat.messages.push(message);
            for (const s of socketChat.sockets) {
                if (s !== socket) {
                    console.log("Sent new message to another socket");
                    s.emit('new-messages', [message]);
                }
            }
        }
    });

    socket.on('disconnect', () => {
        if (socketChat) {
            utils.removeObjectFromArray(socket, socketChat.sockets);
        }
        socketChat = null;
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