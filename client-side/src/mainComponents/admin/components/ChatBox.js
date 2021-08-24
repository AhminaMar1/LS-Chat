import React, {useState, useEffect, useLayoutEffect, useCallback, useRef} from 'react';
import { useAppState } from '../reducers/AppState';
import '../../../styles/admin.scss';
import Messages from './Messages';
import SendMessage from './SendMessage';
import ChatHeader from './ChatHeader';
import env from "react-dotenv";
import axios from 'axios';

const API_URL = env.API_URL;


export default function ChatBox({socket, typeScreen}) {
    const refListenerToScrolling = useRef(null);
    
    const [{adminData, chatBoxActive}, dispatch] = useAppState();
    
    const [doNewRefresh, setDoNewRefresh] = useState(false);
    const [stopNewRefreshes, setStopNewRefreshes] = useState(false);
    const [youCanRefreshes, setYouCanRefreshes] = useState(false);
    const [weGetAll, setWeGetAll] = useState(false);

    
    const [docIdTurn, setDocIdTurn] = useState(null);

    //Get new messages when scrolling to top

    const scrollTop = () => {
        refListenerToScrolling.current.scrollTo(0, 2);
    
    }

    const scrollHandle = useCallback((e) => {

            let scroll = e.target.scrollTop;
            let doNewrefresh = scroll < 100 && scroll > 1;
            if (scroll < 2) {
                scrollTop();
            }
            setDoNewRefresh(doNewrefresh);

    },[]);

    useLayoutEffect(() => {
        refListenerToScrolling.current.addEventListener('scroll', scrollHandle);

        //To debugging an eslint err
        let checkRefCurrent = null;
        if (refListenerToScrolling.current) {
            checkRefCurrent = refListenerToScrolling.current;
        }

        return () => {
            checkRefCurrent.removeEventListener('scroll', scrollHandle)
        }

    }, [refListenerToScrolling, scrollHandle]);

    const restartRefreshes = () => {
        setDoNewRefresh(false);
        setStopNewRefreshes(false);
    }

    useEffect(() => {
        if(youCanRefreshes && doNewRefresh && !stopNewRefreshes && !weGetAll) {
            setStopNewRefreshes(true);
            if (adminData && adminData.id && adminData.token) {
                console.log("Cccccc" + docIdTurn)
                axios.get(`${API_URL}/client/prevchatdoc?admin=yes&admin_id=${adminData.id}&admin_token=${adminData.token}&id_user=${chatBoxActive}&doc_id=${docIdTurn}`)
                .then((data) => {
                    let messagesData = data.data;

                    if(messagesData) {

                        let turn = messagesData.doc_id_turn,
                            messages = messagesData.messages || [];

                        dispatch({type: 'addMessagesFromMongo', payload: messages})
                        console.log(messages);
                        if (turn) {
                            setDocIdTurn(turn);
                        } else {
                            setWeGetAll(true)
                        }
                    }
                    
                }).catch((err) => console.log(err));

            } else {
                restartRefreshes(false);
            }
        }


    }, [weGetAll, adminData, stopNewRefreshes, doNewRefresh, dispatch, chatBoxActive, docIdTurn, youCanRefreshes])


    return (
        <div ref={refListenerToScrolling} className="flex-chat-box" id="chat-display">
            <div className="chat-container">
                <ChatHeader />
                <Messages socket={socket} setYouCanRefreshes={setYouCanRefreshes} setStopNewRefreshes={setStopNewRefreshes} typeScreen={typeScreen} />
                <SendMessage socket={socket}/>
            </div>
            
        </div>
    )
}
