import React, {useEffect, useRef} from 'react'
import { useAppState } from '../reducers/AppState';
import env from "react-dotenv";
import axios from 'axios';

const API_URL = env.API_URL;

export default function Messages() {
    //Ref
    const refForScrolling = useRef(null);
    //States
    const [{adminData, chatBoxActive, messages}, dispath] = useAppState();

    //Effects
    useEffect(() => {
        if(chatBoxActive && adminData && adminData.id && adminData.token) {
            axios.get(`${API_URL}/client/lastchatdoc?admin=yes&admin_id=${adminData.id}&admin_token=${adminData.token}&id_user=${chatBoxActive}`)
                .then((data) => {
                    //TODO: Send a socket emit for #the reach#
                    dispath({type: 'addMessages', payload: data.data});    
                }
                ).catch((err) => console.log(err));
        }
    }, [chatBoxActive, adminData, dispath])


    useEffect(() => {
        refForScrolling.current.scrollIntoView();
    }, [messages])
    
    return (
        <>
            {messages.map((el) => 
                <div key={el.id} className={el.from === chatBoxActive ? 'chat-msg chat-msg-user' : 'chat-msg chat-msg-admin'}>
                    <div>
                        {(el.seen === true) ?
                            <i className="fas fa-check-double check-active"/>
                        : (el.reach === true) ?
                            <i className="fas fa-check-double" />
                        : (el.sent === true) ?
                            <i className="fas fa-check" />
                        : ''
                        }
                    </div>
                    <p>
                        {el.mssg}
                    </p>
                </div>
            )}
            <div ref={refForScrolling}></div>
        </>
    )
}
