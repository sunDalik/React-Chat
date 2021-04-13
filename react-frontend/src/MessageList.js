import React from 'react';
import Message from "./Message";

const MessageList = ({messages}) => {
    const chatMessagesList = React.createRef();

    React.useEffect(() => {
        chatMessagesList.current.scrollTop = chatMessagesList.current.scrollHeight + 999;
    }, [messages, chatMessagesList]);

    return (
        <div className="chat-messages-list" ref={chatMessagesList}>
            {messages.map((m, i) => {
                return <Message key={i} text={m.text} date={m.date} name={m.name}/>;
            })}
        </div>
    );
};

export default MessageList;