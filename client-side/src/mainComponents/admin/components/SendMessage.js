import React, {useState, useLayoutEffect, useCallback, useRef} from 'react'
import { useAppState } from '../reducers/AppState';
import { v4 as uuid } from 'uuid';
import {returnNotSeen} from '../../../functions/seenAndRechedFunctions';

export default function SendMessage({socket}) {

    const refInput = useRef(null);

    //States
    const [{adminData, chatBoxActive, messages, allSeen}, dispatch] = useAppState();

    const [clickShift, setClickShift] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [allowChange, setAllowChange] = useState(true);
    const [focus, setFocus] = useState(false);

    //Functions

    const submitMessage = (e) => {

        e = e || window.event;

        e.preventDefault();

    }

    const sendMessage = () => {

        let newUuid = uuid();
        let dataEmit = {id: newUuid, checkData: adminData, to: chatBoxActive, message: newMessage}
        
        socket.emit('adminSendMessage', dataEmit);
        
        let now = new Date();
        dispatch({type: 'addOneMessageFromMe', payload: {id: newUuid, mssg: newMessage, date: now}})
        //setMessages(ms => [..

        setNewMessage('');
    }

    const handleChange = (e) => {
        if(allowChange){
            setNewMessage(e.target.value);
        }else{
            setAllowChange(true);
        }
    }

    const handleKeyDown = (e) => {

        e = e || window.event;

        if (!clickShift && e.keyCode === 16) { //shift
            setClickShift(true);
        } else if (!clickShift && e.keyCode === 13) {
            if(newMessage!==''){
                sendMessage();
            }
            setAllowChange(false);
        } else if (clickShift) {
            setClickShift(false);
        }
    
    }

    //
    const switchFocusToTrue = useCallback( ()=> {
        setFocus(true);
    }, []);

    const switchFocusToFalse = useCallback( ()=> {
        setFocus(false);
    }, []);

    useLayoutEffect(() => {
        if(!allSeen && focus && adminData.id && socket && chatBoxActive) {
            let dataEmit = returnNotSeen(messages, adminData, chatBoxActive);
            if (dataEmit) {
                socket.emit('seenFromAdmin', dataEmit);
            }

            dispatch({type: 'allSeenTrue'});
        }
    }, [allSeen, focus, messages, socket, adminData, dispatch, chatBoxActive]);

    useLayoutEffect (() => {


        refInput.current.addEventListener('focusin', switchFocusToTrue);

        refInput.current.addEventListener('focusout', switchFocusToFalse);
        
        //To debugging an eslint err
        let checkRefCurrent = null;
        if (refInput.current) {
            checkRefCurrent = refInput.current;
        }

        return () => {
            checkRefCurrent.removeEventListener('focusin', switchFocusToTrue)
            checkRefCurrent.addEventListener('focusout', switchFocusToFalse);
        }
    }, [switchFocusToTrue, switchFocusToFalse]);
    
    return (
        <form onSubmit={submitMessage}>
            <div className="input-chat-box-flex">
                <div className="input-chat-box">
                    <div className="button-group">
                        <button>Send</button>
                    </div>
                    <textarea ref={refInput} onKeyDown={handleKeyDown} onChange={handleChange} value={newMessage} type="text"></textarea>
                </div>
            </div>
        </form>
    )
}
