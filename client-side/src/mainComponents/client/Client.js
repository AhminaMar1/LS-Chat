import React, {useState, useEffect} from 'react'
import socketIOClient from "socket.io-client";
import env from "react-dotenv";
import '../../styles/client.scss';
import avatar from '../../img/avatar.jpeg';
import ChatClient from './ChatClient';
import ChatClientCloseCase from './ChatClientCloseCase';


const ENDPOINT = env.END_POINT;


export default function Client() {

    const [togleState, setToggleState]= useState(true);

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on("FromAPI", data => {
            console.log(data);
        });
    }, []);

    return (
        <>
            {(togleState)?

            <ChatClient avatar={avatar} setToggleState={setToggleState}/>
            :
            <ChatClientCloseCase avatar={avatar} setToggleState={setToggleState}/>
            }


        </>
    )
}
