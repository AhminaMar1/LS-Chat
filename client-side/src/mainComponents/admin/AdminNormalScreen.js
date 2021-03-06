import React from 'react';
import ChatBox from './components/ChatBox';
import ConversationBoxes from './components/ConversationBoxes';
import NavbarNS from './components/NavbarNS';
import OnlineUsers from './components/OnlineUsers';

export default function NormalScreen({socket}){

    
    return(
        <div className="main-container-admin">
            <header>
                <NavbarNS />
            </header>
            <main>
                <div className="flex">
                    <ConversationBoxes openConv={true} />
                    <ChatBox socket={socket} typeScreen="normal"/>
                    <OnlineUsers />
                </div>
            </main>
        </div>
    );
}