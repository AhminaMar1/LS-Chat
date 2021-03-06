import React from 'react'
import Messages from './Messages';
import SendMessage from './SendMessage';

export default function ChatClient({myData, nNotification, messages, setMessages, sendMessage, setFocus, avatar, setToggleState}) {

    return (
        <div className="chat-client">
            <div className="header">
                <div className="header-admin-user">
                    <img src={avatar} alt="admin pic" />
                    <div className="name">Omar</div>
                    <i className="i-live-admin" />
                    {(nNotification > 0) ? <div className="n-notification">{nNotification}</div> : ''}
                </div>
                <div className="more-and-close">
                    <span className="dots-icons">
                        <i className="one-dot-icon" />
                        <i className="one-dot-icon" />
                        <i className="one-dot-icon" />
                    </span>
                    <div className="close">×</div>
                </div>
                <div onClick={()=>setToggleState(false)} className="toggle-when-click"></div>
            </div>
            <Messages myData={myData} messages={messages} setMessages={setMessages} />
            <SendMessage sendMessage={sendMessage} setFocus={setFocus}/>

        </div>
    )
}
