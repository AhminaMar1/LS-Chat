const focusReducer = (state, action = {}) => {
    const { type, payload } = action;
    switch (type) {
      case 'switchFocus': {
        return {
          focus: payload,
        }
      }
      default:
        return state
    }
  }
  
  export default focusReducer;