import React from 'react';
import {readLocalStorageEntry, storage, writeLocalStorageEntry} from "./localStorageUtils";

const ThemeSwitch = () => {
    const themeIcon = React.createRef();

    React.useEffect(() => {
        const isLightTheme = readLocalStorageEntry(storage.isLightTheme);
        if (isLightTheme) {
            themeIcon.current.classList.remove("fa-moon");
            themeIcon.current.classList.add("fa-sun");
            document.querySelector(":root").classList.add("light-theme");
        }
    }, [themeIcon]);

    const switchTheme = () => {
        const isLightTheme = !readLocalStorageEntry(storage.isLightTheme);
        if (isLightTheme) {
            themeIcon.current.classList.remove("fa-moon");
            themeIcon.current.classList.add("fa-sun");
            document.querySelector(":root").classList.add("light-theme");
        } else {
            themeIcon.current.classList.remove("fa-sun");
            themeIcon.current.classList.add("fa-moon");
            document.querySelector(":root").classList.remove("light-theme");
        }
        writeLocalStorageEntry(storage.isLightTheme, isLightTheme);
    };

    return (
        <i ref={themeIcon} className="fas fa-moon theme-switch" onClick={switchTheme}/>
    );
};

export default ThemeSwitch;