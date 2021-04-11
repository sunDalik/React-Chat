import React from 'react';

const MessageForm = ({onMessageSend}) => {
    const [currentMessage, setCurrentMessage] = React.useState("");

    const handleCurrentMessageChange = (e) => {
        setCurrentMessage(e.target.value);
    };

    const submitMessage = (e) => {
        e.preventDefault();
        onMessageSend(currentMessage);
        setCurrentMessage("");
    };

    return (
        <form className="chat-send-box" onSubmit={submitMessage}>
            <input value={currentMessage} onChange={handleCurrentMessageChange} className="chat-input"/>
            <button type="Submit" className="send-button">
                <i className="fas fa-paper-plane"/>
            </button>
        </form>
    );
};

export default MessageForm;