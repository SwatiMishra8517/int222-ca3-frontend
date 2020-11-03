import React, { Component, useState, useContext } from "react";
import "./CSS/Contacts.css";
import { Context } from "../Context";
import { useEffect } from "react";
import { GrSearch } from "react-icons/gr";
import { MdDone } from "react-icons/md";

function Contacts() {
    const {
        user: me,
        contacts,
        setCurrentContact,
        currentContact,
        messages,
    } = useContext(Context);
    const [contactsF, setContactsF] = useState(contacts);
    useEffect(() => {
        setContactsF(contacts);
    }, [contacts]);
    const filterContacts = (e) => {
        const text = e.target.value.toLowerCase();
        setContactsF(
            contacts.filter((u) => u.username.toLowerCase().startsWith(text))
        );
    };
    return (
        <div class="container">
            <div className="search">
                <GrSearch size={20} />
                <input
                    type="search"
                    placeholder="Search contact"
                    onChange={filterContacts}
                />
            </div>
            <div className="friends">
                {!contacts && <div>Loading contacts...</div>}
                {contactsF?.length == 0 && <div>No contacts to show.</div>}
                {contactsF?.map((user) => {
                    const MESSAGES = messages[user.uid] || [];
                    const unreadMessages = MESSAGES.filter((m) => m.unread)
                        .length;
                    const lastMessage = MESSAGES[MESSAGES.length - 1];
                    return (
                        <div
                            className={`${
                                user.uid === currentContact
                                    ? "active_contact"
                                    : ""
                            } contact`}
                            onClick={(e) => setCurrentContact(user.uid)}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <img
                                    style={{
                                        height: 40,
                                        width: 40,
                                        borderRadius: "50%",
                                    }}
                                    alt="user"
                                    src={
                                        !/\w+[ai]$/.test(user.name)
                                            ? user.uid === "groupChat"
                                                ? "https://www.flaticon.com/svg/static/icons/svg/166/166258.svg"
                                                : "https://readyrefrigeration.ca/sites/default/files/styles/headshot/adaptive-image/public/nobody.jpg"
                                            : "https://www.kindpng.com/picc/m/695-6955645_female-user-female-user-icon-png-transparent-png.png"
                                    }
                                />
                                <div className="contact_container">
                                    <div className="contact_name">
                                        {user.username}
                                        {user.online && (
                                            <div className="online"></div>
                                        )}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "90%",
                                            color: "grey",
                                            whiteSpace: "nowrap",
                                            padding: "5px 0 0 0",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        {MESSAGES.length > 0 &&
                                        !user.typing &&
                                        lastMessage?.user ? (
                                            <MdDone
                                                style={{ padding: "0 5px 0 0" }}
                                            />
                                        ) : lastMessage?.sender &&
                                          !user.typing ? (
                                            lastMessage.sender + ": "
                                        ) : (
                                            "" || ""
                                        )}
                                        {user.typing ? (
                                            <div
                                                style={{
                                                    color: "green",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {user.sender
                                                    ? user.sender +
                                                      ": typing..."
                                                    : "typing..."}
                                            </div>
                                        ) : (
                                            lastMessage && (
                                                <div
                                                    style={{
                                                        fontWeight: lastMessage.unread
                                                            ? "bold"
                                                            : "normal",
                                                    }}
                                                >
                                                    {lastMessage?.text
                                                        ?.replace(/<br>/g, " ")
                                                        .split("")
                                                        .slice(0, 35)
                                                        .join("") + "..." || ""}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                            {unreadMessages > 0 &&
                                user.uid !== currentContact && (
                                    <div className="badge">
                                        {unreadMessages}
                                    </div>
                                )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
export default Contacts;
