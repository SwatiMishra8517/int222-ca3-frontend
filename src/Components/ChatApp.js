import React, { Component, useContext } from 'react'
import ChatBox from './ChatBox'
import Contacts from './Contacts'
import  Nav from './Nav/Nav'
import Context from '../Context'
import { Redirect } from 'react-router-dom'
import client from '../api/client'

function ChatApp(){
    const { user, setContacts, setCurrentContact } = useContext(Context);
    if(!user){
        return <Redirect to='/login' />
    }
    return (
        <div>
            <ChatBox/>
            <Contacts/>
            <Nav/>
        </div>
    )
}

export default ChatApp
