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

    const [togleState, setToggleState] = useState(true);
    const [myData, setMyData] = useState({});

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
            }else {
                setMyData({
                    id: myData._id,
                    token: myData.token
                })                
            }
        });

        const socket = socketIOClient(ENDPOINT);
        socket.on("FromAPI", data => {
            console.log(data);
        });

    }, []);

    useEffect(() => {
        console.log(myData)
    }, [myData])

    return (
        <div className="chat-client-main-container">
            {(togleState)?

            <ChatClient avatar={avatar} setToggleState={setToggleState}/>
            :
            <ChatClientCloseCase avatar={avatar} setToggleState={setToggleState}/>
            }


        </div>
    )
}
