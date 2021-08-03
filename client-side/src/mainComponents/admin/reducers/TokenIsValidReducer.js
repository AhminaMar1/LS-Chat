const tokenIsValidReducer = (state, action = {}) => {
    const {type} = action;
    switch (type) {
      case 'tokenIsTrue': {
        return {
          ...state,
          tokenIsValid: true,
        }
      }
      case 'tokenIsFalse': {
        return {
          ...state,
          tokenIsValid: false,
        }
      }
      default:
        return state
    }
  }
  
  export default tokenIsValidReducer;