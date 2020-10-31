import React, { Component, useState, useContext } from "react";
import "./CSS/login.css";
import client from "../api/client";
import { Link, useHistory } from "react-router-dom";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();

        client
            .post("/auth/signup", {
                name,
                email,
                password,
                username,
            })
            .then((res) => {
                if (res.error) {
                    setError(res.error);
                } else {
                    setSuccess("you are registered successfully");
                    setTimeout(() => {
                        history.push("/login");
                    }, 2000);
                }
            });
    };
    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <h1>Signup</h1>
                <p style={{ color: "red" }}>{error}</p>
                <p style={{ color: "green" }}>{success}</p>
                <input
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    name="name"
                    placeholder="name"
                />
                <input
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    placeholder="username"
                />
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    name="email"
                    placeholder="email"
                />
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    name="pwd"
                    placeholder="password"
                />
                <input type="submit" value="signup" />
                <p>
                    If already registered then <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Signup;
