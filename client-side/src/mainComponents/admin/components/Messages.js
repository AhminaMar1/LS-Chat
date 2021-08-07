import React, {useEffect, useRef} from 'react'
import { useAppState } from '../reducers/AppState';
import env from "react-dotenv";
import axios from 'axios';
import {returnNotSeen} from '../../../functions/seenFunction'

const API_URL = env.API_URL;

export default function Messages({socket}) {
    //Ref
    const refForScrolling = useRef(null);
    //States
    const [{adminData, chatBoxActive, messages, focus, allSeen}, dispatch] = useAppState();

    //Effects
    useEffect(() => {
        if(chatBoxActive && adminData && adminData.id && adminData.token) {
            axios.get(`${API_URL}/client/lastchatdoc?admin=yes&admin_id=${adminData.id}&admin_token=${adminData.token}&id_user=${chatBoxActive}`)
                .then((data) => {
                    //TODO: Send a socket emit for #the reach#
                    dispatch({type: 'addMessages', payload: data.data});    
                }
                ).catch((err) => console.log(err));
        }
    }, [chatBoxActive, adminData, dispatch])


    useEffect(() => {
        refForScrolling.current.scrollIntoView();
    }, [messages]);

    useEffect(() => {
        if(!allSeen && focus && adminData.id && socket && chatBoxActive) {
            let dataEmit = returnNotSeen(messages, adminData, chatBoxActive);
            if (dataEmit) {
                socket.emit('seenFromAdmin', dataEmit);
            }

            dispatch({type: 'allSeenTrue'});
        }
    }, [allSeen, focus, messages, socket, adminData, dispatch, chatBoxActive]);
    
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
