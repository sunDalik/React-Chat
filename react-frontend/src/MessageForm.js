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
        <form className="chat-send-form" onSubmit={submitMessage}>
            <input value={currentMessage} onChange={handleCurrentMessageChange} className="chat-send-form__input"/>
            <button type="Submit" className="chat-send-form__button">
                <i className="fas fa-paper-plane"/>
            </button>
        </form>
    );
};

export default MessageForm;