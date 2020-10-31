import React, { Component, useContext, useState } from 'react'
import './CSS/login.css'
import Context from "../Context"
import client from '../api/client';
import { useHistory, Redirect, Link } from "react-router-dom";

function Login(){
    const {setUser,user} = useContext(Context);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const history = useHistory();

    const handleSubmit = (e)=>{
        e.preventDefault()
        
        client
            .post("/auth/login", {
                email,
                password,
            })
            .then((res) => {
                if (res.error) {
                    setError(res.error);
                } else {
                    // setError(JSON.stringify(res))
                    setUser(res.user);
                    history.push("/");
                    localStorage.setItem("user", JSON.stringify(res.user));
                }
            });
    }

    if(user){
        return <Redirect to="/" />
    }

    return (
        <div className="login">
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <p style={{ color: "red" }}>{error}</p>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Email"
                />
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Password"
                />
                <input type="submit" value="login" />
                <p>
                    If not registered then <Link to="/signup">Signup</Link>
                </p>
            </form>
        </div>
    );
}

Login.contextType = Context;

export default Login
