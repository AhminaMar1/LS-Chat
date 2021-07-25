import React, {useState, useEffect} from 'react'
import socketIOClient from "socket.io-client";
import NormalScreen from './AdminNormalScreen';
import SmallScreen from './AdminSmallScreen';
import axios from 'axios';
import env from "react-dotenv";
import { useAppState } from './reducers/AppState'



const ENDPOINT = env.END_POINT;
const API_URL = env.API_URL;

export default function AdminUnified({windowWidth}) {

  //States
  const [{adminData, onlineUsers}, dispatch] = useAppState()
  const [socketOn, setSocketOn] = useState(false);
  const [socket, setSocket] = useState();

  
  //Effects
  useEffect(() => {
    
    let id = localStorage.getItem('ltc_admin_id');
    let token = localStorage.getItem('ltc_admin_token');

    dispatch({type: 'addAdminData', payload: {id, token}})


  }, [dispatch]);

  //First GET
  useEffect(() => {
    if(adminData && adminData.id && adminData.token){

      axios.get(`${API_URL}/admin/firstget?admin_id=${adminData.id}&admin_token=${adminData.token}`)
      .then((data) => {

        dispatch({type: 'addOnlineUsers', payload: data.data.onlines})
        
      }).catch((err) => console.log(err));
    }

  }, [adminData, dispatch]) //dispatch is const

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
        dispatch({type: 'addOneOnlineUser', payload: data});
      });
      
      socket.on("RemoveFromOnlineUsers", data => {
        dispatch({type: 'removeOneOnlineUser', payload: data})
      });

    }
  }, [socketOn, adminData, socket, dispatch]);

    return (
        <div>
            {windowWidth > 1000 ?
            <NormalScreen />
            :<SmallScreen />}
        </div>
    )
}
