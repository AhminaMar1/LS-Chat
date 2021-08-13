import React, {useState, useEffect} from 'react';
import { AppStateProvider } from './reducers/AppState'
import {initialState, combineReducers} from './reducers/Reducers'
import adminDataReducer from './reducers/AdminDataReducer'
import tokenIsValidReducer from './reducers/TokenIsValidReducer'
import onlineUsersReducer from './reducers/OnlineUsersReducer'
import chatBoxActiveReducer from './reducers/ChatBoxActiveReducer'
import messagesReducer from './reducers/MessagesReducer'
import conversationsReducer from './reducers/ConversationsReducer'
import focusReducer from './reducers/FocusReducer';
import allSeenReducer from './reducers/AllSeenReducer';
import AdminUnified from './AdminUnified';

function Admin() {

  //Create redux store
  const combineRed = combineReducers({
    adminData: adminDataReducer,
    tokenIsValid: tokenIsValidReducer,
    chatBoxActive: chatBoxActiveReducer,
    focus: focusReducer,
    allSeen: allSeenReducer,
    onlineUsers: onlineUsersReducer,
    messages: messagesReducer,
    conversations: conversationsReducer
  })
  
  //States
  const [windowWidth, setWindowWidth] = useState(1400);
  
  //Effects
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', ()=>{
      setWindowWidth(window.innerWidth);
    });

  }, []);

  return (
    <div>
      <AppStateProvider reducer={combineRed} initialState={initialState} >
        <AdminUnified windowWidth={windowWidth}/>
      </AppStateProvider>
    </div>
  );
}

export default Admin;
