import React, {useEffect, useState} from 'react';
import NormalScreen from './AdminNormalScreen';
import SmallScreen from './AdminSmallScreen';
import socketIOClient from "socket.io-client";
import env from "react-dotenv";

const ENDPOINT = env.END_POINT;


function Admin() {

  //States
  const [socket, setSocket] = useState();
  const [windowWidth, setWindowWidth] = useState(1400);
  const [onlineUsers, setOnlineUsers] = useState([]);
  //Effects
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', ()=>{
      setWindowWidth(window.innerWidth);
    });

    //Socket io

    const socket = socketIOClient(ENDPOINT);
    
    socket.on("FromAPI", data => {
      console.log(data);
    });

    socket.emit("ImAdmin", data => {
      console.log(data);
    });

    socket.on("newOnlineUser", data => {
      console.log(data);
    })

    socket.on("RemoveFromOnlineUsers", data => {
      console.log(data);
    })

    setSocket(socket);

  }, []);

  //
  return (
    <div>
      {console.log(onlineUsers)}
      {windowWidth>1000?<NormalScreen />:<SmallScreen />}
    </div>
  );
}

export default Admin;
