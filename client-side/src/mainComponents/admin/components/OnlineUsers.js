import React from 'react'

export default function OnlineUsers({onlineUsers, setChatBoxActive}) {
    return (

        <div className="flex-online-box" id="online-display">
            <div className="list-online">
                <h2>online</h2>

                
                {onlineUsers.map( (el) => {
                    return(
                        <div key={el.id} className="online-item">
                            <div className="online-icon"></div>
                            {el.name}
                        </div>
                    )
                })}


                <div className="online-item" onClick={() => setChatBoxActive(true)}>
                    <div className="online-icon"></div>
                    <div className="online-icon-name">John doe</div>
                </div>

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
