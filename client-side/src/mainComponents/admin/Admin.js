import React, {useState, useEffect} from 'react';
import socketIOClient from "socket.io-client";
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import Reducers from './reducers/Reducers'
import axios from 'axios';
import NormalScreen from './AdminNormalScreen';
import SmallScreen from './AdminSmallScreen';
import env from "react-dotenv";

const ENDPOINT = env.END_POINT;
const API_URL = env.API_URL;

function Admin() {

  //Create redux store
  const store = createStore(Reducers)
  
  //States
  const [adminData, setAdminData] = useState({id: false, token: false});
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

    let id = localStorage.getItem('ltc_admin_id');
    let token = localStorage.getItem('ltc_admin_token');

    setAdminData({
      id,
      token
    });


  }, []);

  //First GET
  useEffect(() => {
    if(adminData && adminData.id && adminData.token){
      axios.get(`${API_URL}/admin/firstget?admin_id=${adminData.id}&admin_token=${adminData.token}`)
      .then((data) => {
        
        let obj = data.data.onlines;
        let arr = [];
        Object.keys(obj).forEach(function(key) {
          arr.push({
            id: key,
            name: obj[key]
          })
        });

        setOnlineUsers(arr);
        
      }).catch((err) => console.log(err));
    }

  }, [adminData])

  //Start the socket
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    
    socket.on("FromAPI", data => {
        console.log(data);
    });

    setSocket(socket);
    
    setSocketOn(true);
  }, [])
  
  //If socket start => create the listeners and send the first
  useEffect(() => {    
    if(socketOn && adminData && adminData.id && adminData.token){
      
      socket.emit('ImAdmin', {
        admin_id: adminData.id,
        admin_token: adminData.token
      });

      socket.on("newOnlineUser", data => {
        addNewOnlineUser(data);
      });
      
      socket.on("RemoveFromOnlineUsers", data => {
        removeAnOnlineUser(data)
      });

    }
  }, [socketOn, adminData, socket]);

  //
  return (
    <div>
      <Provider store={store}>
        {windowWidth > 1000 ?
                    <NormalScreen adminData={adminData} onlineUsers={onlineUsers} />
                    :<SmallScreen adminData={adminData} onlineUsers={onlineUsers}/>}
      </Provider>
    </div>
  );
}

export default Admin;
