import React from 'react';
import "./index.css";

const ChatPage = () => {
    const [messages, setMessages] = React.useState([]);

    return (
        <div className="chatPage">
            <div className="chat-messages-list">
                {messages.map(m => <div key={m} className="chat-message">m</div>)}
            </div>
            <input className="chat-input"/>
        </div>
    );
};

export default ChatPage;