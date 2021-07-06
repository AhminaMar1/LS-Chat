import React, {useEffect} from 'react'
import socketIOClient from "socket.io-client";
import env from "react-dotenv";


const ENDPOINT = env.END_POINT;


export default function Client() {

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on("FromAPI", data => {
          console.log(data);
        });
      }, []);


    return (
        <div>
            Client
        </div>
    )
}
