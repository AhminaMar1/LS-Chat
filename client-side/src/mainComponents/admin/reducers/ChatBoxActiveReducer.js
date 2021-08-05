const chatBoxActiveReducer = (state, action = {}) => {
    const { type, payload } = action;
    switch (type) {
      case 'chatBoxActive': {
        return {
          chatBoxActive: payload,
        }
      }
      default:
        return state
    }
  }
  
  export default chatBoxActiveReducer;