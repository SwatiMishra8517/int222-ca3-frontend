import React, { useContext } from "react";
import { Context } from "../Context";
import { Redirect, useHistory } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

function Profile() {
    // let user = localStorage.getItem("user")
    let { user } = useContext(Context);
    const history = useHistory();
    // if(user){
    //     user = JSON.parse(user)
    // }
    // else{
    //     user = {}
    // }
    if (!user) {
        return <Redirect to="/" />;
    }
    return (
        <div>
            <div style={{ display: "flex" }}>
                <div
                    onClick={() => {
                        history.push("/");
                    }}
                    style={{
                        cursor: "pointer",
                        margin: 10,
                        display: "flex",
                        alignItems: "center",
                        alignSelf: "flex-start",
                        padding: 10,
                        background: "steelblue",
                        color: "white",
                        borderRadius: 5,
                    }}
                >
                    <IoIosArrowBack size={32} /> Go to Home
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div flex="4">
                    <img
                        style={{ width: "200px", objectFit: "contain" }}
                        alt="user"
                        src={
                            !/\w+[ai]$/.test(user.name)
                                ? "https://readyrefrigeration.ca/sites/default/files/styles/headshot/adaptive-image/public/nobody.jpg"
                                : "https://www.kindpng.com/picc/m/695-6955645_female-user-female-user-icon-png-transparent-png.png"
                        }
                    />

                    <h1>{user.name}</h1>
                    <p>@{user.username}</p>
                    <p>{user.email}</p>
                    {/* <p>email: {user.email}</p> */}
                    {/* <p>Phone No. : {user.mobile}</p> */}
                </div>
            </div>
        </div>
    );
}

export default Profile;
