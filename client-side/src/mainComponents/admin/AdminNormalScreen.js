import React, {useState} from 'react';
import ChatBox from './components/ChatBox';
import ConversationBoxes from './components/ConversationBoxes';
import NavbarNS from './components/NavbarNS';
import OnlineUsers from './components/OnlineUsers';

export default function NormalScreen({adminData, onlineUsers}){

    const [chatBoxActive, setChatBoxActive] = useState(false);

    
    return(
        <div className="main-container-admin">
            <header>
                <NavbarNS chatBoxActive={chatBoxActive}/>
            </header>
            <main>
                <div className="flex">
                    <ConversationBoxes setChatBoxActive={setChatBoxActive}/>
                    <ChatBox adminData={adminData} chatBoxActive={chatBoxActive}/>
                    <OnlineUsers onlineUsers={onlineUsers} setChatBoxActive={setChatBoxActive}/>
                </div>
            </main>
        </div>
    );
}