import React, {useState, useEffect} from 'react'

export default function FlashMessage({message, toHid, newToHidState}) {
    
    
    const [counter, setCounter] = useState(7);

    const interval = () => {
        setInterval(() => {
            setCounter(c => c-1)
        }, 1000)
    }
    useEffect(() => {

        interval();

        return () => clearInterval(interval)
    }, []);

    useEffect(() => {
        if (counter <= 0){
            toHid(newToHidState)
        }
    }, [counter, toHid, newToHidState]);
    
    return (
        <div className="contianer-flash-message">
            <div className="close"><span>×</span></div>
            <div className="counter">{counter}</div>
            <p>{message}</p>
        </div>
    )
}
