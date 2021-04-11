import React from 'react';
import {socket} from "./App";
import {readLocalStorageEntry, storage} from "./localStorageUtils";
import Username from "./Username";
import MessageForm from "./MessageForm";
import MessageList from "./MessageList";
import ThemeSwitch from "./ThemeSwitch";

const ChatPage = () => {
    const [messages, setMessages] = React.useState([]);

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

    const getCurrentDate = () => {
        const padTime = (time) => {
            const strTime = time.toString();
            if (strTime.length === 1) return "0" + strTime;
            else return strTime;
        };

        const currentDate = new Date();
        const hours = padTime(currentDate.getHours());
        const minutes = padTime(currentDate.getMinutes());
        const seconds = padTime(currentDate.getSeconds());
        return `${hours}:${minutes}:${seconds}`;
    };

    const sendMessage = (message) => {
        const msgObject = {text: message, date: getCurrentDate(), name: readLocalStorageEntry(storage.username)};
        socket.emit('new-messages', msgObject);
        updateMessages([msgObject]);
    };

    return (
        <div className="chatPage">
            <ThemeSwitch/>
            <Username/>
            <div className="chat-main">
                <MessageList messages={messages}/>
                <MessageForm onMessageSend={sendMessage}/>
            </div>
        </div>
    );
};

export default ChatPage;
