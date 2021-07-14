import React, {useState, useEffect} from 'react'
import socketIOClient from "socket.io-client";
import env from "react-dotenv";
import '../../styles/client.scss';
import avatar from '../../img/avatar.jpeg';
import ChatClient from './ChatClient';
import ChatClientCloseCase from './ChatClientCloseCase';
import axios from 'axios';


const ENDPOINT = env.END_POINT;
const API_URL = env.API_URL;


export default function Client() {

    //States
    const [togleState, setToggleState] = useState(true);
    const [myData, setMyData] = useState({id: false});

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const [socket, setSocket] = useState();

    //Effects
    useEffect(() => {
        const data = {
            id: localStorage.getItem('lsc_id'),
            token: localStorage.getItem('lsc_token'),
        };

        axios.post(`${API_URL}/client/startsession`, data)
        .then(res => {
            let status = res.status;
            let myData = res.data;
            if (status === 201){
                localStorage.setItem('lsc_id', myData._id);
                localStorage.setItem('lsc_token', myData.token);
            }
            if (status === 201 || status === 200) {
                setMyData({
                    id: myData._id,
                    token: myData.token,
                    curr_chat_doc_id: myData.curr_chat_doc_id
                })                
            }
        });


    }, []);

    
    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        
        socket.on("FromAPI", data => {
            console.log(data);
        });

        setSocket(socket);
    }, [])

    useEffect(() => {
        if(myData.id){
            socket.emit('newRedisSession', {
                user_id: myData.id,
                token: myData.token
            });

            socket.on('newMessage', (data) => {
                setMessages(ms => [...ms, data])
            })

        }

    }, [myData, socket])
    //Functions

    const sendMessage = () => {
        socket.emit('sendMessage', {checkData: myData, message: newMessage});
        setNewMessage('');
    }


    return (
        <div className="chat-client-main-container">
            {(togleState)?

            <ChatClient messages={messages} sendMessage={sendMessage} newMessage={newMessage} setNewMessage={setNewMessage} avatar={avatar} setToggleState={setToggleState}/>
            :
            <ChatClientCloseCase avatar={avatar} setToggleState={setToggleState}/>
            }


        </div>
    )
}
