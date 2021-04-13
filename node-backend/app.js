const DEBUG = true;
const path = require("path");
const utils = require('./utils.js');
const express = require('express');
const app = express();
const port = 8000;
const server = app.listen(port, () => {
    console.log(`Node.js server is listening at port ${port}`);
});

const io = require('socket.io')(server, {
    transports: ["websocket"]
});

app.use(express.static(path.join(__dirname, "..", "react-frontend", "build")));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "..", "react-frontend", "build", "index.html"));
});

const chats = [];
const MAX_PARTICIPANTS = 2;

io.on('connection', (socket) => {
    debug('New client connected');
    let socketChat = null;

    socket.on('join-chat', (url, responseCallback) => {
        debug("User is trying to join a chat " + url);
        if (socketChat) {
            utils.removeObjectFromArray(socket, socketChat.sockets);
        }
        const newChat = chats.find(c => c.url === url);
        if (!newChat) {
            debug("Chat " + url + " not found");
            responseCallback(null);
        } else if (newChat.sockets.length < MAX_PARTICIPANTS) {
            socketChat = newChat;
            debug("User got connected to " + socketChat.url);
            socketChat.sockets.push(socket);
            responseCallback(true);
            socket.emit('new-messages', newChat.messages);
        } else {
            debug("Chat " + newChat.url + " is full");
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
        debug("Got new message");
        if (socketChat) {
            debug("Pushed new message to " + socketChat.url);
            socketChat.messages.push(message);
            for (const s of socketChat.sockets) {
                if (s !== socket) {
                    debug("Sent new message to another socket");
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
        debug('User got disconnected');
    });
});

function generateNewChat() {
    let attempt = 0;
    while (attempt++ < 9999) {
        const url = utils.getRandomString(4);
        if (chats.every(c => c.url !== url)) {
            const newChat = {url: url, messages: [], sockets: []};
            chats.push(newChat);
            return newChat;
        }
    }
    throw new Error();
}

function debug(message) {
    if (DEBUG) {
        console.log(message);
    }
}