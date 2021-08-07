import React, {useState, useEffect, useCallback} from 'react'
import socketIOClient from "socket.io-client";
import env from "react-dotenv";
import '../../styles/client.scss';
import avatar from '../../img/avatar.jpeg';
import ChatClient from './ChatClient';
import ChatClientCloseCase from './ChatClientCloseCase';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import {oneMessageFormat, messagesFormat} from '../../functions/messagesFormat';


const ENDPOINT = env.END_POINT;
const API_URL = env.API_URL;


export default function Client() {

    //States
    const [togleState, setToggleState] = useState(true);
    const [myData, setMyData] = useState({id: false, token:false});

    const [messages, setMessages] = useState([]);

    const [socket, setSocket] = useState();
    const [socketOn, setSocketOn] = useState(false);
    const [focus, setFocus] = useState(false);
    const [allSeen, setAllSeen] = useState(false);

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
        setSocketOn(true);

    }, [])

    //First GET
    useEffect(() => {
        if(myData && myData.id && myData.token){
            axios.get(`${API_URL}/client/lastchatdoc?id=${myData.id}&token=${myData.token}`)
            .then((data) => {
                //TODO: Send a socket emit for #the reach#

                let mssgArr = messagesFormat(data.data || {});
                setMessages(mssgArr)
            
        }).catch((err) => console.log(err));
        }

    }, [myData])

    //Add same listeners and new redis session SOCKETS
    useEffect(() => {
        if(socketOn && myData.id){
            socket.emit('newRedisSession', {
                user_id: myData.id,
                token: myData.token
            });

            socket.on('newMessageFromMe', (data) => {
                let id = data.id;
                setMessages(ms => {

                    let existe = ms.some(el => el.id === id);
                    if (existe) {
                        return ms.map((el) => {
    
                            if (id === el.id){
                                el.sent = true;
                            }
                            return el;
                        })
                    } else {

                        let dataStore = oneMessageFormat(data, [true, false, false]);

                        return [...ms, dataStore]
                    }
                });

            })

            socket.on('newMessage', (data) => {

                let dataEmit = {reached_id: data.id, one_message: true, checkData: myData}
                socket.emit('reachedToUser', dataEmit);

                let dataStore = oneMessageFormat(data, [true, true, false]);
                setMessages(ms => [...ms, dataStore]);
                setAllSeen(false)

            })

            socket.on('reachedAndSeen', (data) => {
                setMessages((ms) => ms.map(el => {

                    if(el.id === data.id) {
                        el.reach = data.reached;
                        el.seen = data.seen;
                    }

                    return el;

                }))
            });
            

            return () => {
                socket.off('newMessage');
                socket.off('reachedAndSeen');
                socket.off('newMessageFromMe');
            }

        }

    }, [myData, socket, socketOn])

    useEffect(() => {
        if(!allSeen && focus && socketOn) {
            let needToSeenArr = [];
            for(let i=messages.length-1, finish = false; i>=0 && finish === false; i--) {

                let el = messages[i];
                if(el.from !== myData.id && el.seen === false) {
                    needToSeenArr.push(el.id);
                } else if (el.from !== myData.id && el.seen === true) {
                    finish = true;
                }

            }

            if(needToSeenArr.length > 0) {
                let dataEmit = {
                    seen_id: needToSeenArr,
                    one_message: needToSeenArr.length === 1 ? true : false,
                    checkData: myData
                }
                socket.emit('seenFromUser', dataEmit);
            }
            
            setAllSeen(true);
        }
    }, [allSeen, focus, messages, socket, socketOn, myData]);
    
    //Functions

    const sendMessage = useCallback((newMessage) => {
        let newUuid = uuid();
        let dataEmit = {id: newUuid, checkData: myData, message: newMessage}
        
        socket.emit('sendMessage', dataEmit);
        
        let now = new Date();
        let data = {
            id: newUuid,
            sender_id: myData.id,
            mssg: newMessage,
            date: now
        }
        let dataStore = oneMessageFormat(data, [false, false, false]);
        setMessages(ms => [...ms, dataStore])

    }, [myData, socket]);


    return (
        <div className="chat-client-main-container">
            
            {
            (myData.id === false) ? '' :
            (togleState) ?
            <ChatClient myId={myData.id} messages={messages} sendMessage={sendMessage} setFocus={setFocus} avatar={avatar} setToggleState={setToggleState}/>
            :
            <ChatClientCloseCase avatar={avatar} setToggleState={setToggleState}/>
            }


        </div>
    )
}
