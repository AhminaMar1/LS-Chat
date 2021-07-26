import React, {useState} from 'react';
import { useAppState } from './reducers/AppState'
import ChatBox from './components/ChatBox';
import ConversationBoxes from './components/ConversationBoxes';
import NavbarSS from './components/NavbarSS';
import OnlineUsers from './components/OnlineUsers';

export default function SmallScreen({socket}){

    //states
    const [{chatBoxActive}] = useAppState();
    const [blockId, setBlockId] = useState(1); // 0, 1, or 2
        // 1 => ConversationBoxes (last 10 conversation and its last message)
        // 2 => OnlineUsers

    return(
        <div className="main-container-admin">
            <header>
                <NavbarSS blockId={blockId} setBlockId={setBlockId} />
            </header>
            <main>
                <div className="flex">
                    {(chatBoxActive) ? 
                    <ChatBox socket={socket}/> 
                    : (blockId===1) ? 
                    <ConversationBoxes /> 
                    : (blockId===2) ? 
                    <OnlineUsers /> 
                    : ''}
                </div>
            </main>
        </div>
    );
}