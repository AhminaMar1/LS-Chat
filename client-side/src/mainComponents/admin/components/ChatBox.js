import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useAppState } from '../reducers/AppState';
import '../../../styles/admin.scss';
import env from "react-dotenv";
import { v4 as uuid } from 'uuid';


const API_URL = env.API_URL;

export default function ChatBox() {
    //States
    const [{adminData, chatBoxActive, messages}, dispath] = useAppState();
    const [clickShift, setClickShift] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [allowChange, setAllowChange] = useState(true);

    
    //Effects
    useEffect(() => {
        if(chatBoxActive && adminData && adminData.id && adminData.token) {
            axios.get(`${API_URL}/client/lastchatdoc?admin=yes&admin_id=${adminData.id}&admin_token=${adminData.token}&id_user=${chatBoxActive}`)
                .then((data) => {
                    dispath({type: 'addMessages', payload: data.data});
                
            }).catch((err) => console.log(err));
        }
    }, [chatBoxActive, adminData, dispath])

    //Functions

    const submitMessage = (e) => {

        e = e || window.event;

        e.preventDefault();

    }

    const sendMessage = () => {

        let newUuid = uuid();
        //let dataEmit = {id: newUuid, checkData: adminData, to: chatBoxActive, message: newMessage}
        
        //socket.emit('adminSendMessage', dataEmit);
        //Todo: we need to add a listener in the socket for the send-message from admin
        
        let dataStore = {
            id: newUuid,
            from: 'admin-me',
            mssg: newMessage,
            sent: false,
            reach: false,
            seen: false
        }

        //setMessages(ms => [...ms, dataStore])
        console.log(dataStore);
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
        <div className="flex-chat-box" id="chat-display">
            <div className="chat-container">
                {messages.map((el) => 
                        <div key={el.id} className="chat-msg">
                            <p className={el.from === 'me' ? 'chat-msg-user' : 'chat-msg-admin'}>
                                {el.mssg}
                            </p>
                        </div>
                    )}
                
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
                    
            </div>
            
        </div>
    )
}
