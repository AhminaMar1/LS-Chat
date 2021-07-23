import React, {useState, useEffect} from 'react';
import socketIOClient from "socket.io-client";
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import Reducers from './reducers/Reducers'
import NormalScreen from './AdminNormalScreen';
import SmallScreen from './AdminSmallScreen';
import env from "react-dotenv";

const ENDPOINT = env.END_POINT;

function Admin() {

  //Create redux store
  const store = createStore(Reducers)
  
  //States
  const [socketOn, setSocketOn] = useState(false)
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
        return [data, ...list];
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
  }, []);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    
    socket.on("FromAPI", data => {
        console.log(data);
    });

    setSocket(socket);
    
    setSocketOn(true);
  }, [])
  
  
  useEffect(() => {    
    if(socketOn){
      
      let id = localStorage.getItem('ltc_admin_id');
      let token = localStorage.getItem('ltc_admin_token');
      
      if(id && token){
        socket.emit('ImAdmin', {
          admin_id: id,
          admin_token: token
        });
      }

      socket.on("newOnlineUser", data => {
        addNewOnlineUser(data);
      });
      
      socket.on("RemoveFromOnlineUsers", data => {
        removeAnOnlineUser(data)
      });

    }
  }, [socketOn, socket]);

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
