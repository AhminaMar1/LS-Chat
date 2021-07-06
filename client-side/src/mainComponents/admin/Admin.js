import React, {useEffect, useState} from 'react';
import NormalScreen from './AdminNormalScreen';
import SmallScreen from './AdminSmallScreen';
import socketIOClient from "socket.io-client";
import env from "react-dotenv";

const ENDPOINT = env.END_POINT;


function Admin() {

  const [windowWidth, setWindowWidth] = useState(1400);

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
  }, []);

  return (
    <div>
      {windowWidth>1000?<NormalScreen />:<SmallScreen />}
    </div>
  );
}

export default Admin;
