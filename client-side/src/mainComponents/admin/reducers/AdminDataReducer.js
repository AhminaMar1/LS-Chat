const adminDataReducer = (state, action = {}) => {
    const { type } = action;
    const { payload } = action;
    switch (type) {
      case 'addAdminData': {
        return {
          adminData: {id: payload.id, token: payload.token},
        }
      }
      default:
        return state
    }
  }
  
  export default adminDataReducer;