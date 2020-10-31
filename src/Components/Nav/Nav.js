import React, { Component, useContext } from "react";
import "./Nav.css";
import { FaBeer, FaHome, FaUserAlt, FaUsers } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import Tab from "./Tab";
import { useHistory, Link } from "react-router-dom";
import Context from "../../Context";
import SocketClient from "../../SocketClient";

function Nav() {
    const history = useHistory();
    const { setUser } = useContext(Context);
    return (
        <div className="Nav">
            <Link to="/" className="nav-link">
                <Tab label="Home" icon={FaHome} size={32} />
            </Link>
            <Link to="/profile" className="nav-link">
                <Tab label="Profile" icon={FaUserAlt} size={32} />
            </Link>
            <Tab
                onClick={() => {
                    localStorage.removeItem("user");
                    setUser(null);
                    SocketClient.disconnect();
                    window.location.href = "/login";
                }}
                label="Logout"
                icon={FiLogOut}
                size={32}
            />
        </div>
    );
}

export default Nav;
