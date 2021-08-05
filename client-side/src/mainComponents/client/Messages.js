import React, {useEffect, useRef} from 'react'

export default function Messages({myId, messages}) {
    //Ref
    const refForScrolling = useRef(null);

    //Effects
    useEffect(() => {
        refForScrolling.current.scrollIntoView();
    }, [messages]);

    return (

        <div className="messages-group">
            { (messages.length >= 1) ? messages.map( (data) => {
                return <div className={data.from === myId ? 'me' : ''} key={data.id}>
                    <div>
                        {(data.seen === true) ?
                            <i className="fas fa-check-double check-active"/>
                        : (data.reach === true) ?
                            <i className="fas fa-check-double" />
                        : (data.sent === true) ?
                            <i className="fas fa-check" />
                        : ''
                        }
                    </div>
                    <p>
                        {data.mssg}
                    </p>
                    </div>
            }) : ''}
            <div ref={refForScrolling}></div>
        </div>
    )
}
