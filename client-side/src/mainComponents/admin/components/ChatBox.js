import React from 'react';
import '../../../styles/admin.scss';
import Messages from './Messages';
import SendMessage from './SendMessage';



export default function ChatBox({socket}) {

    return (
        <div className="flex-chat-box" id="chat-display">
            <div className="chat-container">
                <Messages socket={socket} />
                <SendMessage socket={socket}/>
            </div>
            
        </div>
    )
}
