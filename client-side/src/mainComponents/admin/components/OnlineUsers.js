import React from 'react'

export default function OnlineUsers({onlineUsers, setChatBoxActive}) {
    return (

        <div className="flex-online-box" id="online-display">
            <div className="list-online">
                <h2>online</h2>

                
                {onlineUsers.map( (el) => {
                    return(
                        <div onClick={() => setChatBoxActive(el.id)} key={el.id} className="online-item">
                            <div className="online-icon"></div>
                            {el.name}
                        </div>
                    )
                })}

                <div className="online-item">
                    <div className="online-icon"></div>
                    John doe
                </div>

                <div className="online-item">
                    <div className="online-icon"></div>
                    John doe
                </div>


            </div>
        </div>
    )
}
