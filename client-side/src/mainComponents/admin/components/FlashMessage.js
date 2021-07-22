import React, {useState, useEffect} from 'react'

export default function FlashMessage({type, message, toHid, newToHidState}) {
    
    //styles
    const warningStyle = {
        backgroundColor: '#ffeb85',
    }
    const successStyle = {
        backgroundColor: '#dff2c1',
    }
    const errorStyle = {
        backgroundColor: '#f7baba',
    }
    const infStyle = {
        backgroundColor: '#f7baba',
    }

    //states
    const [counter, setCounter] = useState(7);

    //setInterval (id)
    const interval = () => {
        setInterval(() => {
            setCounter(c => c-1)
        }, 1000)
    }

    // use effects
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
        <div className="contianer-flash-message"
        style={
            type==='succ' ? successStyle
            :type==='inf' ? infStyle
            :type==='error' ? errorStyle
            : warningStyle}>
            <div className="close"><span>×</span></div>
            <div className="counter">{counter}</div>
            <p>{message}</p>
        </div>
    )
}
