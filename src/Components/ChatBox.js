import React, { useContext, useState } from "react";
import "./CSS/ChatBox.css";
import { Context } from "../Context";
import socket from "../SocketClient";
import { useEffect } from "react";
import SocketClient from "../SocketClient";
import moment from "moment";
import sounds from "../helpers/sound";
import { BsArrowDownShort } from "react-icons/bs";

function ChatBox() {
    const { user } = useContext(Context);
    let timeout = null;
    const [isTyping, setIsTyping] = React.useState(false);
    const { contacts, messages, currentContact, setMessages } = useContext(
        Context
    );
    const CONTACT = contacts?.find((user) => user.uid === currentContact) || {};
    const MESSAGES = messages[currentContact] || [];
    const text = document.getElementById("textarea");
    const messageRef = React.useRef();

    const scrollToBottom = () => {
        messageRef.current.scrollTo({
            top: messageRef.current.scrollHeight,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        setMessages((prev) => {
            if (!prev[currentContact]) {
                prev[currentContact] = [];
            }
            return {
                ...prev,
                [currentContact]: [...prev[currentContact]].map((e) => ({
                    ...e,
                    unread: undefined,
                })),
            };
        });
    }, [currentContact]);

    useEffect(() => {
        if (MESSAGES[MESSAGES.length - 1]?.user) {
            scrollToBottom();
        }
    }, [messages]);

    function send() {
        let message = text.innerText;
        message = message.replace(/\n/g, "<br>").trim();
        console.log(message);
        if (message.trim() === "") {
            return;
        }
        socket.emit("message", { text: message, to: currentContact });
        sounds.MESSAGE_SENT.play();
        text.innerText = "";
        setMessages((prev) => {
            if (!prev[currentContact]) {
                prev[currentContact] = [];
            }
            return {
                ...prev,
                [currentContact]: [
                    ...prev[currentContact],
                    { text: message, user: true, time: Date.now() },
                ],
            };
        });
    }
    const onTyping = () => {
        clearTimeout(timeout);
        if (!isTyping) SocketClient.emit("typeStart", { to: currentContact });
        setIsTyping(true);
        timeout = setTimeout(() => {
            if (isTyping) {
                SocketClient.emit("typeEnd", { to: currentContact });
                setIsTyping(false);
            }
        }, 2000);
    };
    return (
        <div className="chatbox">
            <header
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 0px 10px 20px",
                }}
            >
                <img
                    style={{ height: 40, width: 40, borderRadius: "50%" }}
                    alt="user"
                    src={
                        !/\w+[ai]$/.test(user.name)
                            ? CONTACT.uid === "groupChat"
                                ? "https://www.flaticon.com/svg/static/icons/svg/166/166258.svg"
                                : "https://readyrefrigeration.ca/sites/default/files/styles/headshot/adaptive-image/public/nobody.jpg"
                            : "https://www.kindpng.com/picc/m/695-6955645_female-user-female-user-icon-png-transparent-png.png"
                    }
                />
                <div
                    style={{
                        margin: "0px 20px",
                    }}
                >
                    <h1>{CONTACT.username}</h1>
                    {CONTACT.typing ? (
                        <div style={{ color: "white", margin: 0, padding: 0 }}>
                            {CONTACT.sender
                                ? CONTACT.sender + ": typing..."
                                : "typing..."}
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </header>
            <div className="sections" ref={messageRef}>
                {MESSAGES.map((message) => {
                    return (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <div
                                className={`${
                                    message.user ||
                                    message.sender === user.username
                                        ? "message_sender"
                                        : "message_receiver"
                                } message`}
                            >
                                {message.sender &&
                                    message.sender !== user.username && (
                                        <div
                                            style={{
                                                color: "#253757",
                                                fontWeight: "bold",
                                                fontSize: "90%",
                                            }}
                                        >
                                            {message.sender}
                                        </div>
                                    )}
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: message.text,
                                    }}
                                ></span>
                                <div
                                    style={{
                                        color: "#c1c1c1",
                                        fontSize: "70%",
                                        alignSelf: "flex-end",
                                        textAlign: "right",
                                    }}
                                >
                                    {moment(new Date(message.time)).calendar()}
                                </div>
                            </div>
                            {/* {
                                    message.user && <div className="message message_sender">{message.text}</div>
                                }
                                {
                                    !message.user && <div className="message message_receiver">{message.text}</div>
                                } */}
                        </div>
                    );
                })}
            </div>
            <footer>
                <div className="scroll-top" onClick={scrollToBottom}>
                    <BsArrowDownShort size={34} color="white" />
                </div>
                {/* <div id="search-container">
                    <div>
                        <div class="material-icons icon">search</div>
                            <input id="search" type="text" placeholder="item..." />
                    </div>
                </div> */}
                <div id="text-container">
                    <p
                        id="textarea"
                        placeholder="Type a message.."
                        contentEditable={true}
                        onKeyPress={onTyping}
                    ></p>
                    <button onClick={send}>send</button>
                </div>
            </footer>
        </div>
    );
}

export default ChatBox;
