const conversationsReducer = (state, action = {}) => {
    const { type, payload } = action;
    switch (type) {
      case 'addConversationsList': {
        return {
          conversations: payload,
        }
      }
      default:
        return state
    }
  }
  
  export default conversationsReducer;