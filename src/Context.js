import React, { createContext } from "react";
import { useState } from "reinspect";
import App from "./App";

export const Context = createContext()

export function AppProvider({children}){
    const [user, setUser] = React.useState(null);
    const [contacts, setContacts] = useState(null, "contacts");
    const [messages, setMessages] = useState({}, "messages");
    const [currentContact, setCurrentContact] = useState(
        null,
        "currentContact"
    );

    return (
        <Context.Provider value={{
            user,setUser,
            messages,setMessages,
            contacts,setContacts,
            currentContact,setCurrentContact
            }} >
                {children}
        </Context.Provider>
    )
}

export default Context