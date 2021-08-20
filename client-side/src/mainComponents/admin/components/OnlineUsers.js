import React from 'react'
import { useAppState } from '../reducers/AppState';
import Image from './Image';

export default function OnlineUsers() {

    const [{onlineUsers}, dispatch] = useAppState();

    //function
    const clickHandle = (el) => {

        let data = {
            name: el.name,
            url_pic: false
        }

        dispatch({type:'chatBoxActive', payload: el.id})
        dispatch({type:'newDataClient', payload: data}); //We need to change the url_pic if we got the pic of user from another place.
    }

    return (

        <div className="flex-online-box" id="online-display">
            <div className="list-online">
                <h2>online</h2>

                
                {onlineUsers.map( (el) => {
                    return(
                        <div onClick={() => clickHandle(el)} key={el.id} className="online-item">
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
