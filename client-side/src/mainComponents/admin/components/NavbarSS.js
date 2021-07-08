import React from 'react'

export default function NavbarSS({blockId, setBlockId, chatBoxActive, setChatBoxActive}) {
    //styles
    const blockDisplayStyle = {
        display: 'block'
    };

    const activeStyle = {
        display: 'block',
        borderBottom: '3px solid #40748a'

    };

    const noneDisplayStyle = {
        display: 'none'
    };


    return (
        <div className="nav-bar-for-min-screen">
            <div className="nav-bar-for-min-screen-flex">
                <div className="nav-bar-for-min-screen-flex-item back-msg" style={(chatBoxActive) ? blockDisplayStyle : noneDisplayStyle}>
                    <div className="back-msg-flex" onClick={() => setChatBoxActive(false)}>
                        <i className="fas fa-arrow-left arrow-back" /><p>BACK</p>
                    </div>
                </div>
                <div className="nav-bar-for-min-screen-flex-item nav-bar-min-screen-active" style={(chatBoxActive) ? noneDisplayStyle : (blockId===1) ? activeStyle : blockDisplayStyle} onClick={() => setBlockId(1)}>messages</div>
                <div className="nav-bar-for-min-screen-flex-item left-auto" style={(chatBoxActive) ? noneDisplayStyle : (blockId===2) ? activeStyle : blockDisplayStyle} onClick={() => setBlockId(2)}>online</div>
            </div>
        </div>
    )
}
