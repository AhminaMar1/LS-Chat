import React from 'react'

export default function ChatClient({avatar, setToggleState}) {
    return (
        <div className="chat-client">
            <div className="header">
                <div className="header-admin-user">
                    <img src={avatar} alt="admin pic" />
                    <div className="name">Omar</div>
                    <i className="i-live-admin" />
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
            <div className="input-group">
                <div className="button-flex">
                    <button><i className="far fa-paper-plane" /></button>
                </div>
                <textarea name="message"></textarea>
            </div>
        </div>
    )
}
