import React from 'react';
import ChatBox from './components/ChatBox';
import ConversationBoxes from './components/ConversationBoxes';
import NavbarNS from './components/NavbarNS';
import OnlineUsers from './components/OnlineUsers';

export default function NormalScreen(){

    const setChatBoxActive = () => {
        //Currently it is null
    }
    
    return(
        <div className="main-container-admin">
            <header>
                <NavbarNS />
            </header>
            <main>
                <div className="flex">
                    <ConversationBoxes setChatBoxActive={setChatBoxActive}/>
                    <ChatBox />
                    <OnlineUsers setChatBoxActive={setChatBoxActive}/>
                </div>
            </main>
        </div>
    );
}