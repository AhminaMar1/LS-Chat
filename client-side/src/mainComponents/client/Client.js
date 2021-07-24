import React, {useState, useEffect} from 'react'
import socketIOClient from "socket.io-client";
import env from "react-dotenv";
import '../../styles/client.scss';
import avatar from '../../img/avatar.jpeg';
import ChatClient from './ChatClient';
import ChatClientCloseCase from './ChatClientCloseCase';
import axios from 'axios';
import { v4 as uuid } from 'uuid';


const ENDPOINT = env.END_POINT;
const API_URL = env.API_URL;


export default function Client() {

    //States
    const [togleState, setToggleState] = useState(true);
    const [myData, setMyData] = useState({id: false, token:false});

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

    //Init the socket
    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        
        socket.on("FromAPI", data => {
            console.log(data);

        });

        setSocket(socket);
    }, [])

      //First GET
    useEffect(() => {
        if(myData && myData.id && myData.token){
            axios.get(`${API_URL}/client/lastchatdoc?id=${myData.id}&token=${myData.token}`)
            .then((data) => {

                let allMssg = data.data;
                let mssgArr = [];

                for(let i = 0; i < allMssg.length; i=i+6){
                    let dataStore = {
                        id: allMssg[i],
                        mssg: allMssg[i+2],
                        sent: true,
                        reach: (allMssg[i+3] === 'true' ? true : false),
                        seen: (allMssg[i+4] === 'true' ? true : false)
                    }
                    mssgArr.push(dataStore);
                }

                setMessages(mssgArr)
            
        }).catch((err) => console.log(err));
        }

    }, [myData])

    //Add same listeners and new redis session SOCKETS
    useEffect(() => {
        if(myData.id){
            socket.emit('newRedisSession', {
                user_id: myData.id,
                token: myData.token
            });

            socket.on('newMessage', (data) => {
                let id = data.id;
                setMessages(ms => ms.map((el) => {
                    if (id === el.id){
                        el.sent = true;
                    }
                    return el;
                }))

            })

        }

    }, [myData, socket])

    //Functions

    const sendMessage = () => {
        
        let newUuid = uuid();
        let dataEmit = {id: newUuid, checkData: myData, message: newMessage}
        
        socket.emit('sendMessage', dataEmit);
        
        let dataStore = {
            id: newUuid,
            mssg: newMessage,
            sent: false,
            reach: false,
            seen: false
        }
        setMessages(ms => [...ms, dataStore])
        
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
