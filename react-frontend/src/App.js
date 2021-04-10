import React from 'react';
import axios from "axios";
import CreateChatButton from "./CreateChatButton";
import ChatPage from "./ChatPage";
import socketClient from "socket.io-client";

const SERVER = "http://localhost:8000";

const App = () => {
    const socket = socketClient(SERVER);

    const [isChatPage, setIsChatPage] = React.useState(false);

    const loadChatPage = (url) => {
        setIsChatPage(true);
    };

    React.useEffect(() => {
        axios.get("/chat/test")
            .then(res => {
                console.log(res);
            });
    });

    return (
        <div className="app">
            {isChatPage ? null : <CreateChatButton loadChatPage={loadChatPage}/>}
            {isChatPage ? <ChatPage/> : null}
        </div>
    );
};

export default App;
