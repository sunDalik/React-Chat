import React from 'react';
import ChatPage from "./ChatPage";
import socketClient from "socket.io-client";

const SERVER = "http://localhost:8000";
export const socket = socketClient(SERVER, {transports: ["websocket"]});

const App = () => {
    return (
        <ChatPage/>
    );
};

export default App;