import React from 'react';
import ChatPage from "./ChatPage";
import socketClient from "socket.io-client";

const SERVER = "http://localhost:8000";

const App = (props) => {
    const socket = socketClient(SERVER, {transports: ["websocket"]});

    const createNewChat = () => {
        alert("Sent request to create new chat");
        socket.emit('new-chat', (res) => {
            if (res === "") {
                alert("No chat rooms available. Please try again later.");
            } else {
                alert("Created new chat " + res);
                window.history.pushState("", "", res);
            }
        });
    };

    React.useEffect(() => {
        if (window.location.pathname === "/") {
            createNewChat();
        } else {
            const chatUrl = window.location.pathname.slice(1);
            alert("Waiting to connect to " + chatUrl);
            socket.emit('join-chat', chatUrl, (res) => {
                if (res === false) {
                    alert(`Chat ${chatUrl} is full!`);
                } else if (res === null) {
                    alert(`Chat ${chatUrl} doesn't exist!`);
                }

                if (res !== true) {
                    createNewChat();
                }
            });
        }
    });

    return (
        <ChatPage/>
    );
};

export default App;
