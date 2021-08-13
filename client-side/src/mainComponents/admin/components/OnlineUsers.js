import React from 'react'
import { useAppState } from '../reducers/AppState';
import Image from './Image';

export default function OnlineUsers() {

    const [{onlineUsers}, dispatch] = useAppState();

    return (

        <div className="flex-online-box" id="online-display">
            <div className="list-online">
                <h2>online</h2>

                
                {onlineUsers.map( (el) => {
                    return(
                        <div onClick={() => dispatch({type:'chatBoxActive', payload: el.id})} key={el.id} className="online-item">
                            <div className="online-icon"></div>
                            <Image id={el.id} name={el.name}/>
                            {el.name}
                        </div>
                    )
                })}

            </div>
        </div>
    )
}
