import React from 'react';
import {readLocalStorageEntry, storage, writeLocalStorageEntry} from "./localStorageUtils";

const Username = () => {
    const nameInput = React.createRef();

    React.useEffect(() => {
        nameInput.current.value = readLocalStorageEntry(storage.username);
    }, []);

    const focusUsernameInput = () => {
        nameInput.current.focus();
    };

    const changeUsername = (e) => {
        writeLocalStorageEntry(storage.username, e.target.value);
        //TODO notification about new name
    };

    return (
        <div className="name-box" onClick={focusUsernameInput}>
            <input ref={nameInput} className="name-box__input" onBlur={changeUsername} maxLength="20"/>
            <i className="fas fa-user name-box__icon"/>
        </div>
    );
};

export default Username;