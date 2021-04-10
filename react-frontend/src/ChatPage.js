import React from 'react';
import {socket} from "./App";
import Message from "./Message";
import {readLocalStorageEntry, storage, writeLocalStorageEntry} from "./localStorageUtils";

const ChatPage = (props) => {
    const [messages, setMessages] = React.useState([]);
    const [currentMessage, setCurrentMessage] = React.useState("");
    const nameInput = React.createRef();
    const chatMessagesList = React.createRef();

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
        nameInput.current.value = readLocalStorageEntry(storage.username);
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

    React.useEffect(() => {
        chatMessagesList.current.scrollTop = chatMessagesList.current.scrollHeight + 999;
    }, [messages]);

    const handleCurrentMessageChange = (e) => {
        setCurrentMessage(e.target.value);
    };

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

    const sendMessage = (e) => {
        e.preventDefault();
        const msgObject = {text: currentMessage, date: getCurrentDate(), name: readLocalStorageEntry(storage.username)};
        socket.emit('new-messages', msgObject);
        updateMessages([msgObject]);
        setCurrentMessage("");
    };

    const changeUsername = (e) => {
        writeLocalStorageEntry(storage.username, e.target.value);
    };

    return (
        <div className="chatPage">
            <div className="name-box">
                <input ref={nameInput} className="name-input" onChange={changeUsername}/>
                <i className="fas fa-user user-icon"/>
            </div>
            <div className="chat-main">
                <div className="chat-messages-list" ref={chatMessagesList}>
                    {messages.map((m, i) => {
                        return <Message key={i} text={m.text} date={m.date} name={m.name}/>;
                    })}
                </div>
                <form className="chat-send-box" onSubmit={sendMessage}>
                    <input value={currentMessage} onChange={handleCurrentMessageChange} className="chat-input"/>
                    <button type="Submit" className="send-button">
                        <i className="fas fa-paper-plane"/>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
