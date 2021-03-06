import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'
import SetTheTitle from '../../SetTheTitle';
import Image from './Image';
import { useAppState } from '../reducers/AppState';
import axios from 'axios';
import env from "react-dotenv";

const API_URL = env.API_URL;



export default function ConversationBoxes({openConv}) {

    //Ref
    const convRef = useRef(null);

    //States & states with useReduser
    const [{conversations, chatBoxActive, adminData}, dispatch] = useAppState();
    const [doNewRefresh, setDoNewRefresh] = useState(false);
    const [stopNewRefreshes, setStopNewRefreshes] = useState(false);
    const [nNotification, setNNotification] = useState(0);

    //Effect
    useEffect(() => {
        if (conversations.length > 0 && adminData && adminData.id && (conversations[0].name === '??' || !conversations[0].name)) {
            axios.get(`${API_URL}/admin/getname?admin_id=${adminData.id}&admin_token=${adminData.token}&user_id=${conversations[0].id}`)
                .then((data) => {
                    dispatch({type: 'setConvName', payload: data.data})
                }
                ).catch((err) => console.log(err));
            }    
    }, [conversations, adminData, dispatch]);

    
    const scrollHandle = (e) => {

        let doNewrefresh = e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight) < 100;
        
        setDoNewRefresh(doNewrefresh);
    }
    useLayoutEffect(() => {
        convRef.current.addEventListener('scroll', scrollHandle);

        //To debugging an eslint err
        let checkRefCurrent = null;
        if (convRef.current) {
            checkRefCurrent = convRef.current;
        }

        return () => {
            checkRefCurrent.removeEventListener('scroll', scrollHandle)
        }

    }, []);

    const restartRefreshes = () => {
        setDoNewRefresh(false);
        setStopNewRefreshes(false);
    }

    useEffect(() => {
        
        if(doNewRefresh && !stopNewRefreshes) {
            setStopNewRefreshes(true);
            if (adminData && adminData.id && adminData.token && conversations.length > 0) {
                let idOftheLast = conversations[conversations.length-1].id;

                axios.get(`${API_URL}/admin/moreconversations?admin_id=${adminData.id}&admin_token=${adminData.token}&id_start=${idOftheLast}`)
                .then((data) => {
                    if (data.data.length > 0) {
                        dispatch({type: 'newConversationsList', payload: data.data});
                        restartRefreshes(false);
                    }
                }
                ).catch((err) => {
                    console.log(err);
                    restartRefreshes(false);
                });

            } else {
                restartRefreshes(false);
            }
        }


    }, [adminData, doNewRefresh, stopNewRefreshes, conversations, dispatch])

    useEffect(() => {

        if(openConv && !chatBoxActive && conversations.length > 0) {
            dispatch({type: 'chatBoxActive', payload: conversations[0].id});
            dispatch({type: 'newDataClient', payload: {name: conversations[0].name, url_pic: false}});

            
        }
        
    }, [openConv, chatBoxActive, conversations, dispatch]);

    //clickHandle on conversation of a user
    const clickHandle = (el) => {

        let data = {
            name: el.name,
            url_pic: false
        }

        dispatch({type:'chatBoxActive', payload: el.id})
        dispatch({type:'newDataClient', payload: data}); //We need to change the url_pic if we got the pic of user from another place.
    }

    useEffect(() => {

        let existe = conversations.some(el => !el.seen && el.id === el.sender_id);
        
        setNNotification ((existe) ? -1 : 0);

    }, [conversations]);

    return (
        <div className="flex-msgs-users-box" id="msg-user-display">
            < SetTheTitle nNotification={nNotification}/>
            <div ref={convRef} className="u-m-list">
                
                <div className="search-box">
                    <input type="text" placeholder="search for a user" />
                    <div className="search-button"><i className="fas fa-search" /></div>
                </div>

                {(conversations.length === 0) ? <div className="nothing-found">There are no conversations</div> : ''}

                {conversations.map((el) => {
                    return (
                        <div key={el.id} className={(el.id === chatBoxActive) ? 'u-m-item u-m-item-active' : 'u-m-item'} onClick={() => clickHandle(el)}>
                            <div className="u-m-inf">
                                <Image id={el.id} name={el.name}/>
                                <div className="u-m-name">{el.name}</div>
                                {!el.seen && el.id === el.sender_id ?
                                   <div className="u-m-new"><p>new</p></div>
                                :''}
                                <div className="u-m-date">Today</div>
                            </div>
                            <div className="u-m-msg">{el.mssg}</div>
                            {   
                                (el.seen === true) ?
                                    <i className="fas fa-check-double check-active"/>
                                : (el.reached === true) ?
                                    <i className="fas fa-check-double" />
                                :   <i className="fas fa-check" />
                                
                            }
                        </div>
                    )
                })}

            </div>
        </div>

    )
}
