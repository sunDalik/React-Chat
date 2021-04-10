import React from 'react';
import ChatPage from "./ChatPage";
import socketClient from "socket.io-client";
import {initLocalStorage} from "./localStorageUtils";

const SERVER = "http://localhost:8000";
export const socket = socketClient(SERVER, {transports: ["websocket"]});
initLocalStorage();

const App = () => {
    return (
        <ChatPage/>
    );
};

export default App;