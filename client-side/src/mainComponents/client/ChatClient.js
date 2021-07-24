import React, {useState} from 'react'
import Messages from './Messages';

export default function ChatClient({messages, sendMessage, newMessage, setNewMessage, avatar, setToggleState}) {

    const [clickShift, setClickShift] = useState(false);
    const [allowChange, setAllowChange] = useState(true)
    const handleChange = (e) => {
        if(allowChange){
            setNewMessage(e.target.value);
        }else{
            setAllowChange(true);
        }
    }

    const handleKeyDown = (e) => {
        if (!clickShift && e.keyCode === 16) { //shift
            setClickShift(true);
        } else if (!clickShift && e.keyCode === 13) {
            if(newMessage!==''){
                sendMessage();
            }
            setAllowChange(false);
        } else if (clickShift) {
            setClickShift(false);
        }
    
    }

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
                <textarea name="message" value={newMessage} onKeyDown={handleKeyDown} onChange={(e) => handleChange(e)}></textarea>
            </div>
            <Messages messages={messages} />
        </div>
    )
}
