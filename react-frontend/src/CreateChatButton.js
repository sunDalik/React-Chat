import React from 'react';
import axios from "axios";

const CreateChatButton = ({loadChatPage}) => {
    const createChat = () => {
        axios.get("/newChat")
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    loadChatPage(res.data);
                } else {
                    alert(res.data);
                }
            });
    };

    return (
        <button className="button" onClick={createChat}>
            Create new chat
        </button>
    );
};

export default CreateChatButton;