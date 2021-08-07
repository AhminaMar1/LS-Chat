const initialState = {
    adminData: { id: false, token: false },
    tokenIsValid: null,
    chatBoxActive: false,
    focus: false,
    allSeen: false,
    onlineUsers: [],
    messages: []
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