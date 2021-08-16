import React, {useEffect} from 'react'
import Image from './Image';
import { useAppState } from '../reducers/AppState';
import axios from 'axios';
import env from "react-dotenv";

const API_URL = env.API_URL;



export default function ConversationBoxes() {

    //States with useReduser

    const [{conversations, chatBoxActive, adminData}, dispatch] = useAppState();

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

    return (
        <div className="flex-msgs-users-box" id="msg-user-display">
            <div className="u-m-list">
                
                <div className="search-box">
                    <input type="text" placeholder="search for a user" />
                    <div className="search-button"><i className="fas fa-search" /></div>
                </div>

                {conversations.map((el) => {
                    return (
                        <div key={el.id} className={(el.id === chatBoxActive) ? 'u-m-item u-m-item-active' : 'u-m-item'} onClick={() => dispatch({type: 'chatBoxActive', payload: el.id})}>
                            <div className="u-m-inf">
                                <Image id={el.id} name={el.name}/>
                                <div className="u-m-name">{el.name}</div>
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
