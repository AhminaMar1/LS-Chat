import React, {useEffect, useState} from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import Reducers from './reducers/Reducers'
import NormalScreen from './AdminNormalScreen';
import SmallScreen from './AdminSmallScreen';
import socketIOClient from "socket.io-client";
import env from "react-dotenv";

const ENDPOINT = env.END_POINT;

function Admin() {

  //Create redux store
  const store = createStore(Reducers)
  
  //States
  const [socket, setSocket] = useState();
  const [windowWidth, setWindowWidth] = useState(1400);
  const [onlineUsers, setOnlineUsers] = useState([]);

  //Functons

  /*
    The same data, We use this method to avoid using the useCalback
    because if we had used useCallback the function will change every change the online users
    and changed this function will lead to continuous change in the socket listener of the "newOnlineUser"
  */
  const addNewOnlineUser = (data) => {
    setOnlineUsers( list => {

      let existe = list.some( (el) => {
        return (el.id === data.id);
      })

      if(existe){
        return list;
      } else {
        return [...list, data];
      }


    });
  }

  const removeAnOnlineUser = (data) => {
    setOnlineUsers( list => list.filter(el => el.id !== data.id));
  }

  
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
      console.log("data");
    });

    socket.on("newOnlineUser", data => {
      addNewOnlineUser(data);
    })

    socket.on("RemoveFromOnlineUsers", data => {
      removeAnOnlineUser(data)
    })

    setSocket(socket);

  }, []);

  //
  return (
    <div>
      <Provider store={store}>
        {windowWidth > 1000 ?
                    <NormalScreen onlineUsers={onlineUsers} />
                    :<SmallScreen onlineUsers={onlineUsers}/>}
      </Provider>
    </div>
  );
}

export default Admin;
