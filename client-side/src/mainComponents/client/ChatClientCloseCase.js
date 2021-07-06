import React from 'react'

export default function ChatClientCloseCase({avatar, setToggleState}) {
    return (
        <div onClick={()=>setToggleState(true)} className="chat-client-close-case noselect">
            <div className="notification"><div><span>0</span></div></div>
            <img src={avatar} alt="admin pic" draggable="false" />
        </div>
    )
}