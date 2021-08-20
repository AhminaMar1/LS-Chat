const initialState = {
    adminData: { id: false, token: false },
    tokenIsValid: null,
    chatBoxActive: false,
    dataClient: {name: false, url_pic:false},
    focus: false,
    allSeen: false,
    onlineUsers: [],
    messages: [],
    conversations: []
  }
  
  const combineReducers = reducers => {
    return (state, action) => {
      return Object.keys(reducers).reduce(
        (acc, prop) => {
          return ({
            ...acc,
            ...reducers[prop]({ [prop]: acc[prop] }, action),
          })
        },
        state
      )
    }
  }
  
  export { initialState, combineReducers }