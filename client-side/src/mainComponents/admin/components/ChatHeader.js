import React, {useState, useEffect} from 'react'
import { useAppState } from '../reducers/AppState';
import Image from './Image';

export default function ChatHeader() {

    //Styles
    const noneStyle = {
        display: "none"

    }

    const style = {
        marginLeft: "7px",
        marginTop: "0px",
        zoom: "1.2"
    }

    //States
    const [{chatBoxActive, onlineUsers, dataClient}] = useAppState();
    const [online, setOnline] = useState(false);

    //Effect
    useEffect(() => {
        if(chatBoxActive) {
            
            let newOnlineState = onlineUsers.some(el => el.id === chatBoxActive);
            console.log(newOnlineState)
            setOnline(newOnlineState);
        }

    },[chatBoxActive, onlineUsers])

    return (
        <div className="chat-header">
            {(!dataClient.name) ? <div className="nothing-found">No one selected</div> : ''}
            {chatBoxActive ? <Image id={chatBoxActive} name={dataClient.name}/> : ''}
            <b>{dataClient.name}</b>
            <div className="online-icon" style={(online) ? style : noneStyle}></div>
            
        </div>
    )
}
