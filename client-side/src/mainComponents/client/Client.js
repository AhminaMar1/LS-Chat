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
import {returnNotSeen, theLastForUser, updateMessagesRAS} from '../../functions/seenAndRechedFunctions'; 

const ENDPOINT = env.END_POINT;
const API_URL = env.API_URL;


export default function Client() {

    //States
    const [togleState, setToggleState] = useState(true);
    const [myData, setMyData] = useState({id: false, token:false});

    const [messages, setMessages] = useState([]);
    const [nNotification, setNNotification] = useState(0);
    const [mySeen, setMyseen] = useState(null);
    const [socket, setSocket] = useState(null);
    const [socketOn, setSocketOn] = useState(false);
    const [focus, setFocus] = useState(false);
    const [allSeen, setAllSeen] = useState(false);
    const [reachedNow, setReachedNow] = useState(null);

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
                
                setMyseen(data.data.reached_and_seen.my_seen);
                let mssgArr = messagesFormat(data.data.messages, 
                    {
                        admin_seen: data.data.reached_and_seen.admin_seen,
                        admin_reached: data.data.reached_and_seen.admin_reached,
                        my_reached: data.data.reached_and_seen.my_reached
                    });
                setMessages(mssgArr)

                let theLast = theLastForUser(mssgArr, myData.id);
                if(theLast && theLast !== data.data.reached_and_seen.my_reached) {
                    setReachedNow(theLast);
                }


        }).catch((err) => console.log(err));
        }

    }, [myData]);

    useEffect(() => {
        if(reachedNow && myData && socketOn && socket) {
            let dataEmit = {reached_id: reachedNow, checkData: myData}
            socket.emit('reachedToUser', dataEmit);
            setReachedNow(null);
        }
    }, [reachedNow, socketOn, socket, myData])

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

                setMessages((ms) => {
                    let res = updateMessagesRAS(ms, data); //RAS : reched and seen
                    //The: return(res) is not work, I don't why.
                    return res.map(el => el);
                });
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

            let dataEmit = returnNotSeen(messages, myData);
            socket.emit('seenFromUser', dataEmit);
            
            setAllSeen(true);

            if(dataEmit) {
                setMyseen(dataEmit.seen_id);
            }
        }
    }, [allSeen, focus, messages, socket, socketOn, myData]);

    //Effet to get numbers of notification

    useEffect(() => {
        let messageLen = messages.length;
        if(myData && myData.id && messageLen > 0 && !allSeen) {
            let myId = myData.id, nNotification = 0;
            for(let i = messageLen - 1; i >= 0; i--) {
                if (myId !== messages[i].from && messages[i].id !== mySeen) {
                    nNotification++;
                } else {
                    i = 0;
                }
            }
            setNNotification(nNotification);
            
        }
    }, [messages, myData, mySeen, allSeen])
    
    useEffect(() => {
        if(allSeen) {
            setNNotification(0);
        }
    }, [allSeen])
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
            <ChatClient myId={myData.id} nNotification={nNotification} messages={messages} sendMessage={sendMessage} setFocus={setFocus} avatar={avatar} setToggleState={setToggleState}/>
            :
            <ChatClientCloseCase avatar={avatar} setToggleState={setToggleState}/>
            }


        </div>
    )
}
