import React from 'react';

const Message = ({text, date, name}) => {
    return (
        <div className="chat-message">
            <div className="chat-message__name">{name}</div>
            <div className="chat-message__text">
                <div>{text}</div>
                <div className="chat-message__date">{date}</div>
            </div>
        </div>
    );
};

export default Message;