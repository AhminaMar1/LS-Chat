import React, {useEffect} from 'react';
import axios from 'axios';
import { useAppState } from '../reducers/AppState';
import {messagesOrder} from '../../../functions/messagesOrder';
import '../../../styles/admin.scss';
import env from "react-dotenv";
const API_URL = env.API_URL;

export default function ChatBox() {

    const [{adminData, chatBoxActive, messages}, dispath] = useAppState();
    useEffect(() => {
        if(chatBoxActive && adminData && adminData.id && adminData.token) {
            axios.get(`${API_URL}/client/lastchatdoc?admin=yes&admin_id=${adminData.id}&admin_token=${adminData.token}&id_user=${chatBoxActive}`)
                .then((data) => {
                    dispath({type: 'addMessages', payload: messagesOrder(data.data || [])});
                
            }).catch((err) => console.log(err));
        }
    }, [chatBoxActive, adminData, dispath])

    return (
        <div className="flex-chat-box" id="chat-display">
            <div className="chat-container">
                {messages.map((el) => 
                        <div key={el.id} className="chat-msg">
                            <p className={el.from === 'me' ? 'chat-msg-user' : 'chat-msg-admin'}>
                                {el.mssg}
                            </p>
                        </div>
                    )}
                
                <form>
                    <div className="input-chat-box-flex">
                        <div className="input-chat-box">
                            <div className="button-group">
                                <button>Send</button>
                            </div>
                            <textarea type="text"></textarea>
                        </div>
                    </div>
                </form>
                    
            </div>
            
        </div>
    )
}
