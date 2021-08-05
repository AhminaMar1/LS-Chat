const onlineUsersReducer = (state, action = {}) => {
    const { type } = action;
    const { payload } = action;
    switch (type) {
      case 'addOnlineUsers': {
        
        let obj = payload || [];
        let arr = [];

        Object.keys(obj).forEach(function(key) {
          arr.push({
            id: key,
            name: obj[key]
          })
        });

        return {
          onlineUsers: arr,
        }
      }
      case 'addOneOnlineUser': {
        let data = payload;
        let list = state.onlineUsers;
        let existe = list.some( (el) => {
          return (el.id === data.id);
        })
  
        if(existe){
          //
        } else {
          list = [data, ...list];
        }

        return {
          onlineUsers: list,
        }
      }

      case 'removeOneOnlineUser': {
        let list = state.onlineUsers;
        let data = payload;
        
        list = list.filter(el => el.id !== data.id)
        return {
          onlineUsers: list,
        }
      }

      default:
        return state
    }
  }
  
  export default onlineUsersReducer;