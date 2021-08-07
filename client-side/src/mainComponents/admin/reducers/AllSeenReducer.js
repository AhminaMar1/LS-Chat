const allSeenReducer = (state, action = {}) => {
    const { type } = action;
    switch (type) {
      case 'allSeenTrue': {
        return {
          allSeen: true,
        }
      }
      case 'allSeenFalse': {
        return {
          allSeen: false,
        }
      }
      default:
        return state
    }
  }
  
  export default allSeenReducer;