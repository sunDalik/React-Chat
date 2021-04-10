import React from 'react';
import axios from "axios";
import ChatPage from "./ChatPage";
import socketClient from "socket.io-client";

const SERVER = "http://localhost:8000";

const App = (props) => {
    const socket = socketClient(SERVER, {transports: ["websocket"]});

    React.useEffect(() => {
        axios.get("/newChat")
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    //TODO
                    window.history.pushState("", "", res.data);
                } else {
                }
            });
    });

    return (
        <ChatPage/>
    );
};

export default App;
