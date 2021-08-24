import React, {useState, useEffect, useLayoutEffect, useCallback, useRef} from 'react'
import env from "react-dotenv";
import axios from 'axios';
import {messagesFormatFromMongo} from '../../functions/messagesFormat';

const API_URL = env.API_URL;


export default function Messages({myData, messages, setMessages}) {
    //Ref
    const refForScrolling = useRef(null);
    const refListenerToScrolling = useRef(null);

    //States
    const [numberOfMessages, setNumberOfMessages] = useState(0);

    //Effects
    useEffect(() => {
        let num = messages.length;
        setNumberOfMessages(num);
    }, [messages]);

    useLayoutEffect(() => {
        
        let num = messages.length;
        if(!numberOfMessages) {
    
            refForScrolling.current.scrollIntoView();
            setYouCanRefreshes(true);
            setNumberOfMessages(num);

        }else if (num > numberOfMessages) {
            if(num > numberOfMessages+10) {
                setNumberOfMessages(num);
                
                setTimeout(() => {
                    setStopNewRefreshes(false);
                }, [1000])

            } else {
                refForScrolling.current.scrollIntoView();
                setNumberOfMessages(num);

            }

        }
    }, [messages, numberOfMessages]);

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
            if (myData && myData.id && myData.token) {
                axios.get(`${API_URL}/client/prevchatdoc?id=${myData.id}&token=${myData.token}&doc_id=${docIdTurn}`)
                .then((data) => {
                    let messagesData = data.data;

                    if(messagesData) {

                        let turn = messagesData.doc_id_turn,
                            messages = messagesData.messages || [];

                        
                        
                        setMessages(ms => [...messagesFormatFromMongo(messages), ...ms]);
                        
                        if(turn){
                            setDocIdTurn(turn);
                        } else {
                            setWeGetAll(true);
                        }
                        
                    }
                    
                }).catch((err) => console.log(err));

            } else {
                restartRefreshes(false);
            }
        }


    }, [weGetAll, myData, setMessages, stopNewRefreshes, doNewRefresh, docIdTurn, youCanRefreshes])





    return (
        <div ref={refListenerToScrolling} className="messages-group">
            { (messages.length >= 1) ? messages.map( (data) => {
                return <div className={(myData && data.from === myData.id) ? 'me' : ''} key={data.id}>
                    {(myData && data.from === myData.id) ? <div>
                        {(data.seen === true) ?
                            <i className="fas fa-check-double check-active"/>
                        : (data.reach === true) ?
                            <i className="fas fa-check-double" />
                        : (data.sent === true) ?
                            <i className="fas fa-check" />
                        : ''
                        }
                    </div>
                    : <div className="wid-5"></div> 
                    }
                    <p dir="auto">
                        {data.mssg}
                    </p>
                    </div>
            }) : ''}
            <div ref={refForScrolling}></div>
        </div>
    )
}
