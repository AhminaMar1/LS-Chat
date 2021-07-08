import React from 'react'

export default function OnlineUsers({setChatBoxActive}) {
    return (

        <div className="flex-online-box" id="online-display">
            <div className="list-online">
                <h2>online</h2>

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

                <div className="online-item">
                    <div className="online-icon"></div>
                    John doe
                </div>


            </div>
        </div>
    )
}
