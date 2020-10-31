import React, { useContext, useState } from "react";
import "./CSS/ChatBox.css";
import { Context } from "../Context";
import socket from "../SocketClient";
import { useEffect } from "react";
import SocketClient from "../SocketClient";
import sounds from "../helpers/sound";
import { BsArrowDownShort } from "react-icons/bs";

function ChatBox() {
    const { user } = useContext(Context);
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
                    { text: message, user: true },
                ],
            };
        });
    }
    return (
        <div className="chatbox">
            <header>
                <h1 style={{ marginLeft: 10 }}>{CONTACT.username}</h1>
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
                            {message.sender && message.sender !== user.username && (
                                <span
                                    style={{
                                        margin: "0 0 -10px 10px",
                                        color: "grey",
                                        fontSize: "90%"
                                    }}
                                >
                                    {message.sender}
                                </span>
                            )}
                            <div
                                className={`${
                                    message.user || message.sender === user.username
                                        ? "message_sender"
                                        : "message_receiver"
                                } message`}
                                dangerouslySetInnerHTML={{
                                    __html: message.text,
                                }}
                            ></div>
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
                    ></p>
                    <button onClick={send}>send</button>
                </div>
            </footer>
        </div>
    );
}

export default ChatBox;
