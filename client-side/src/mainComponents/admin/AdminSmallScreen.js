import React, {useState} from 'react';
import ChatBox from './components/ChatBox';
import ConversationBoxes from './components/ConversationBoxes';
import NavbarSS from './components/NavbarSS';
import OnlineUsers from './components/OnlineUsers';

export default function SmallScreen(){

    //states
    const [blockId, setBlockId] = useState(1); // 0, 1, or 2
        // 1 => ConversationBoxes (last 10 conversation and its last message)
        // 2 => OnlineUsers
    
    const [chatBoxActive, setChatBoxActive] = useState(false);

    return(
        <div className="main-container-admin">
            <header>
                <NavbarSS blockId={blockId} setBlockId={setBlockId} chatBoxActive={chatBoxActive} setChatBoxActive={setChatBoxActive} />
            </header>
            <main>
                <div className="flex">
                    {(chatBoxActive) ? 
                    <ChatBox /> 
                    : (blockId===1) ? 
                    <ConversationBoxes setChatBoxActive={setChatBoxActive}/> 
                    : (blockId===2) ? 
                    <OnlineUsers setChatBoxActive={setChatBoxActive}/> 
                    : ''}
                </div>
            </main>
        </div>
    );
}