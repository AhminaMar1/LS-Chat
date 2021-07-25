const messagesReducer = (state, action = {}) => {
    const { type, payload } = action;

    switch (type) {
      case 'addMessages': {
        
        return {
          ...state,
          messages: payload,
        }
      }
      case 'addOneMessage': {

        return {
          ...state,
          messages: [],
        }
      }

      default:
        return state
    }
  }
  
  export default messagesReducer;