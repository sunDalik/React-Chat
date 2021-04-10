import React from 'react';

const Message = ({text, date, name}) => {
    return (
        <div className="chat-message">
            <div className="chat-message-name">{name}</div>
            <div className="chat-message-text">
                <div>{text}</div>
                <div className="chat-message-date">{date}</div>
            </div>
        </div>
    );
};

export default Message;