const tokenIsValidReducer = (state, action = {}) => {
    const {type} = action;
    switch (type) {
      case 'tokenIsValid': {
        return {
          ...state,
          tokenIsValid: true,
        }
      }
      default:
        return state
    }
  }
  
  export default tokenIsValidReducer;