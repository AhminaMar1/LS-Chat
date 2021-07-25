const initialState = {
    adminData: { id: false, token: false },
    chatBoxActive: false,
    onlineUsers: [],
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