import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import { useAppState } from '../reducers/AppState';
import env from "react-dotenv";
import axios from 'axios';
import {theLastForAdmin} from '../../../functions/seenAndRechedFunctions';
import {messagesFormat} from '../../../functions/messagesFormat';

const API_URL = env.API_URL;

export default function Messages({socket}) {
    //Ref
    const refForScrolling = useRef(null);
    //States
    const [{adminData, chatBoxActive, messages}, dispatch] = useAppState();
    const [numberOfMessages, setNumberOfMessages] = useState(0);
    const [reachedNow, setReachedNow] = useState(null);

    //Effects
    useEffect(() => {
        if(chatBoxActive && adminData && adminData.id && adminData.token) {
            axios.get(`${API_URL}/client/lastchatdoc?admin=yes&admin_id=${adminData.id}&admin_token=${adminData.token}&id_user=${chatBoxActive}`)
                .then((data) => {
                    let ras = data.data.reached_and_seen;
                    let mssgArr = messagesFormat(data.data.messages, 
                        {
                            my_seen: ras.my_seen,
                            admin_seen: ras.admin_seen,
                            my_reached: ras.my_reached,
                            admin_reached: ras.admin_reached,
                        }, null, chatBoxActive);

                    dispatch({type: 'addMessages', payload: mssgArr});

                    let theLast = theLastForAdmin(mssgArr, 'admin');
                    if(theLast && theLast !== ras.admin_reached) {
                        setReachedNow(theLast);
                    }

                    dispatch({type: 'allSeenFalse'});

                }
                ).catch((err) => console.log(err));
        }
    }, [chatBoxActive, adminData, dispatch])

    useEffect(() => {
        if(reachedNow && chatBoxActive && adminData && socket) {
            let dataEmit = {reached_id: reachedNow, user_id: chatBoxActive, checkData: adminData}
            socket.emit('reachedToAdmin', dataEmit);
            setReachedNow(null);
        }
    }, [reachedNow, socket, adminData, chatBoxActive])

    useEffect(() => {
        let num = messages.length;
        setNumberOfMessages(num);
    }, [messages]);

    useLayoutEffect(() => {
        refForScrolling.current.scrollIntoView();
    }, [numberOfMessages]);

    
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
