import React, {useState, useEffect} from 'react'
import socketIOClient from "socket.io-client";
import NormalScreen from './AdminNormalScreen';
import SmallScreen from './AdminSmallScreen';
import axios from 'axios';
import env from "react-dotenv";
import { useAppState } from './reducers/AppState';
import Wait from './components/Wait';



const ENDPOINT = env.END_POINT;
const API_URL = env.API_URL;

export default function AdminUnified({windowWidth}) {

  //States
  const [{adminData, tokenIsValid, chatBoxActive}, dispatch] = useAppState()
  const [socketOn, setSocketOn] = useState(false);
  const [socket, setSocket] = useState();

  //Functions
  const redirectToLoginPage = () => {
    window.location.href = '/login';
  }
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
        
        if(data && data.data.token_is_true){
          dispatch({type: 'addOnlineUsers', payload: data.data.onlines});
          
          //Todo: We need to add validation..
          dispatch({type: 'tokenIsTrue'});
        } else {
          //dispatch({type: 'tokenIsFalse'});
        }

        
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
        id: adminData.id,
        token: adminData.token
      });

      socket.on("newOnlineUser", data => {
        dispatch({type: 'addOneOnlineUser', payload: data});
      });
      
      socket.on("RemoveFromOnlineUsers", data => {
        dispatch({type: 'removeOneOnlineUser', payload: data})
      });

      socket.on('newMessageFromAdmin', (data) => {
          dispatch({type: 'addOneMessageFromAdmin', payload: data});
      });

      return () => {
        socket.off('newOnlineUser');
        socket.off('newMessageFromAdmin');
        socket.off('RemoveFromOnlineUsers');
    }

    }
  }, [socketOn, adminData, socket, dispatch]);
  
  useEffect(() => {   
    if(socketOn && adminData && adminData.id && adminData.token){

      socket.on('newMessage', (data) => {
        if(data && data.sender_id === chatBoxActive){
          //TODO: Send a socket emit for #the reach#
          dispatch({type: 'addOneMessageFromUser', payload: data});
        }
      });

      return () => socket.off('newMessage');
    }

  }, [socketOn, socket, adminData, dispatch, chatBoxActive])


    return (
        <div>
          {tokenIsValid ?
            <div>
              {windowWidth > 1000 ?
              <NormalScreen socket={socket}/>
              :<SmallScreen socket={socket}/>}
            </div>
            : tokenIsValid===false ?
              redirectToLoginPage()
            : <Wait />}
        </div>
    )
}
