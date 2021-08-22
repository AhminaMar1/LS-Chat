import React, {useState, useEffect, useLayoutEffect, useRef} from 'react'

export default function Messages({myId, messages}) {
    //Ref
    const refForScrolling = useRef(null);

    //States
    const [numberOfMessages, setNumberOfMessages] = useState(0);

    //Effects
    useEffect(() => {
        let num = messages.length;
        setNumberOfMessages(num);
    }, [messages]);

    useLayoutEffect(() => {
        refForScrolling.current.scrollIntoView();
    }, [numberOfMessages]);


    return (
        <div className="messages-group">
            { (messages.length >= 1) ? messages.map( (data) => {
                return <div className={data.from === myId ? 'me' : ''} key={data.id}>
                    {(data.from === myId) ? <div>
                        {(data.seen === true) ?
                            <i className="fas fa-check-double check-active"/>
                        : (data.reach === true) ?
                            <i className="fas fa-check-double" />
                        : (data.sent === true) ?
                            <i className="fas fa-check" />
                        : ''
                        }
                    </div>
                    : <div className="wid-5"></div> 
                    }
                    <p dir="auto">
                        {data.mssg}
                    </p>
                    </div>
            }) : ''}
            <div ref={refForScrolling}></div>
        </div>
    )
}
