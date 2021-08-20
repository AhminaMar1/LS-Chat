const dataClientReducer = (state, action = {}) => {
    const { type, payload } = action;
    switch (type) {
      case 'newDataClient': {
        return {
          dataClient: {
            name: payload.name,
            url_pic: payload.url_pic,
          },
        }
      }
      default:
        return state
    }
  }
  
  export default dataClientReducer;