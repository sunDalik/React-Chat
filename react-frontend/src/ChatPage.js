import React from 'react';
import {socket} from "./App";

const ChatPage = (props) => {
    const [messages, setMessages] = React.useState([]);
    const [currentMessage, setCurrentMessage] = React.useState("");

    const showError = (message) => {
        console.log(message);
    };

    const createNewChat = () => {
        showError("Sent request to create new chat");
        socket.emit('new-chat', (res) => {
            if (res === "") {
                showError("No chat rooms available. Please try again later.");
            } else {
                showError("Created new chat " + res);
                window.history.pushState("", "", res);
                setMessages([]);
            }
        });
    };

    const updateMessages = (newMessages) => {
        console.log(messages);
        console.log(newMessages);
        setMessages([...messages, ...newMessages]);
    };

    socket.off('new-messages', updateMessages).on('new-messages', updateMessages);

    React.useEffect(() => {
        if (window.location.pathname === "/") {
            createNewChat();
        } else {
            const chatUrl = window.location.pathname.slice(1);
            showError("Waiting to connect to " + chatUrl);
            socket.emit('join-chat', chatUrl, (res) => {
                showError("res = " + res);
                if (res === true) {
                    showError(`Successfully connected!`);
                    setMessages([]);
                } else if (res === false) {
                    showError(`Chat ${chatUrl} is full!`);
                } else if (res === null) {
                    showError(`Chat ${chatUrl} doesn't exist!`);
                }

                if (res !== true) {
                    createNewChat();
                }
            });
        }
    }, []);

    const handleCurrentMessageChange = (e) => {
        setCurrentMessage(e.target.value);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        const msgObject = {text: currentMessage, date: new Date()};
        socket.emit('new-messages', msgObject);
        updateMessages([msgObject]);
        setCurrentMessage("");
    };

    return (
        <div className="chatPage">
            <div className="chat-messages-list">
                {messages.map((m, i) => <div key={i} className="chat-message">{m.text}</div>)}
            </div>
            <form className="flexbox" onSubmit={sendMessage}>
                <input value={currentMessage} onChange={handleCurrentMessageChange} className="chat-input"/>
                <input type="Submit" className="button" value="Submit" readOnly/>
            </form>
        </div>
    );
};

export default ChatPage;
