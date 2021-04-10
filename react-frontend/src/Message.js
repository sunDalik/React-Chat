import React from 'react';

const Message = ({text, date}) => {
    return (
        <div className="chat-message">
            <div>{text}</div>
            <div className="date">{date}</div>
        </div>
    );
};

export default Message;