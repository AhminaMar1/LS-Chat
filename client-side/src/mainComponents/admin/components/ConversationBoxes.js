import React from 'react'
import Image from './Image';
import { useAppState } from '../reducers/AppState';



export default function ConversationBoxes() {

    //States with useReduser

    const [{conversations, chatBoxActive}, dispatch] = useAppState();

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
                            <div className="u-m-msg">{el.message_data[2]}</div>
                        </div>
                    )
                })}

            </div>
        </div>

    )
}
