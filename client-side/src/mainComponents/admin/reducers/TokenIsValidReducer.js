const tokenIsValidReducer = (state, action = {}) => {
    const {type} = action;
    switch (type) {
      case 'tokenIsTrue': {
        return {
          tokenIsValid: true
        }
      }
      case 'tokenIsFalse': {
        return {
          tokenIsValid: false
        }
      }
      default:
        return state
    }
  }
  
  export default tokenIsValidReducer;