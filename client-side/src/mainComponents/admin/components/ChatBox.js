import React, {useEffect} from 'react';
import axios from 'axios';
import { useAppState } from '../reducers/AppState';
import {messagesOrder} from '../../../functions/messagesOrder';
import '../../../styles/admin.scss';
import env from "react-dotenv";
const API_URL = env.API_URL;

export default function ChatBox() {

    const [{adminData, chatBoxActive}] = useAppState();
    useEffect(() => {
        if(chatBoxActive && adminData && adminData.id && adminData.token) {
            axios.get(`${API_URL}/client/lastchatdoc?admin=yes&admin_id=${adminData.id}&admin_token=${adminData.token}&id_user=${chatBoxActive}`)
                .then((data) => {
                    let mssgArr = messagesOrder(data.data || []);

                    //Todo we need to store it under a state of message - with Redux
                    console.log(mssgArr);
                
            }).catch((err) => console.log(err));
        }
    }, [chatBoxActive, adminData])

    return (
        <div className="flex-chat-box" id="chat-display">
            <div className="chat-container">
                <div className="chat-msg">
                    <p className="chat-msg-me">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-user">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut quidem, saepe veniam iure quas error possimus expedita ipsa nostrum minima?
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-me">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-user">
                        Lorem ipsum dolor sit amet consectetur.
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-user">
                        Okay
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-me">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-user">
                        Lorem, ipsum.
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-me">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit
                    </p>
                </div>
                
                <div className="chat-msg">
                    <p className="chat-msg-me">
                        Lorem ipsum dolor, sit amet consectetur adipisicing elit
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-user">
                        Okay
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-user">
                        Lorem, ipsum.
                    </p>
                </div>

                <div className="chat-msg">
                    <p className="chat-msg-user">
                        Okay
                    </p>
                </div>
                
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
