import React, {useState} from 'react'
import { useAppState } from '../reducers/AppState';
import { v4 as uuid } from 'uuid';

export default function SendMessage({socket}) {
    //States
    const [{adminData, chatBoxActive}, dispatch] = useAppState();

    const [clickShift, setClickShift] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [allowChange, setAllowChange] = useState(true);


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
    
    return (
        <form onSubmit={submitMessage}>
            <div className="input-chat-box-flex">
                <div className="input-chat-box">
                    <div className="button-group">
                        <button>Send</button>
                    </div>
                    <textarea onKeyDown={handleKeyDown} onChange={handleChange} value={newMessage} type="text"></textarea>
                </div>
            </div>
        </form>
    )
}
