import React, { Component, useState, useEffect, useContext } from "react";

import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Profile from "./Components/Profile";
import ChatApp from "./Components/ChatApp";

// Uncaught SyntaxError: Unexpected token '!'

// React context API

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import SocketClient from "./SocketClient";
import Context from "./Context";
import sound from "./helpers/sound";
import sounds from "./helpers/sound";

export function App() {
    const {
        setUser,
        user,
        setContacts,
        setMessages,
        currentContact,
        contacts,
        setCurrentContact,
    } = useContext(Context);
    useEffect(() => {
        let u = localStorage.getItem("user");
        if (u) {
            console.log(u);
            u = JSON.parse(u);
            setUser(u);
        }
        SocketClient.on("allUsers", (users) => {
            if (users.length == 0) {
                setContacts([]);
                return;
            }
            let allUsers = users.map((user) => ({ ...user, uid: user._id }));
            const group = { uid: "groupChat", username: "Mega Chat" };
            setContacts([...allUsers, group]);
            setCurrentContact(allUsers[0].uid);
        });
        SocketClient.on("newUser", (userId) => {
            setContacts((users) =>
                users?.map((e) => {
                    return e.uid === userId ? { ...e, online: true } : e;
                })
            );
        });
        SocketClient.on("userLeft", (userId) => {
            setContacts((users) =>
                users?.map((e) => {
                    return e.uid === userId ? { ...e, online: false } : e;
                })
            );
        });

        SocketClient.on("groupChats", (data) => {
            setMessages((prev) => {
                if (!prev.groupChat) {
                    prev.groupChat = [];
                }
                return {
                    ...prev,
                    groupChat: data.map((e) => ({
                        ...e,
                        sender: e.from,
                        user: e.from === u?.username,
                    })),
                };
            });
        });

        SocketClient.on("receiveMessage", (data) => {
            let from = data.from;
            if (data.sender) {
                from = "groupChat";
                console.log(contacts);
            }
            console.log(data);
            if (data.typing !== undefined) {
                if (data.typing) {
                    setContacts((prev) =>
                        prev.map((e) => {
                            if (e.uid === from) {
                                return {
                                    ...e,
                                    typing: true,
                                    sender: data.sender,
                                };
                            }
                            return e;
                        })
                    );
                } else {
                    setContacts((prev) =>
                        prev.map((e) => {
                            if (e.uid === from) {
                                return {
                                    ...e,
                                    typing: false,
                                    sender: data.sender,
                                };
                            }
                            return e;
                        })
                    );
                }
                return;
            }
            sounds.NEW_MESSAGE.play();
            setMessages((prev) => {
                if (!prev[from]) {
                    prev[from] = [];
                }
                return {
                    ...prev,
                    [from]: [
                        ...prev[from],
                        {
                            text: data.text,
                            unread: true,
                            sender:
                                from === "groupChat" ? data.sender : undefined,
                            time: Date.now(),
                        },
                    ],
                };
            });
        });
    }, []);
    useEffect(() => {
        if (user) {
            SocketClient.emit("join", user);
        }
    }, [user]);
    return (
        <Router>
            <div>
                <Switch>
                    <Route exact path="/">
                        <ChatApp />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/profile">
                        <Profile />
                    </Route>
                    <Route path="/signup">
                        <Signup />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
