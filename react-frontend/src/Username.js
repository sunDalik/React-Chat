import React from 'react';
import {readLocalStorageEntry, storage, writeLocalStorageEntry} from "./localStorageUtils";

const Username = () => {
    const nameInput = React.createRef();

    React.useEffect(() => {
        nameInput.current.value = readLocalStorageEntry(storage.username);
    }, []);

    const changeUsername = (e) => {
        writeLocalStorageEntry(storage.username, e.target.value);
        //TODO notification about new name
    };

    return (
        <div className="name-box">
            <input ref={nameInput} className="name-input" onBlur={changeUsername}/>
            <i className="fas fa-user user-icon"/>
        </div>
    );
};

export default Username;