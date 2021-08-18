const convFormat = (el) => {
  return {
    id: el.id,
    mssg_id: el.message_data[0],
    name: el.name,
    sender_id: el.message_data[1],
    mssg: el.message_data[2],
    seen: el.seen,
    reached: el.reached,
    date: el.message_data[3]
  }
}

const conversationsReducer = (state, action = {}) => {
    const { type, payload } = action;
    switch (type) {
      case 'addConversationsList': {
        return {
          conversations: payload.map(el => convFormat(el)),
        }
      }
      case 'newConversationsList': {
        let newConvs = state.conversations;
      
        payload.forEach(el => {
          newConvs.push(convFormat(el))
        });


        return {conversations: newConvs}
        
      }
      case 'updateConversationsList': {
        console.log(payload)
        let theFirstConv = {
          id: payload.to,
          mssg_id: payload.id,
          sender_id: payload.sender_id,
          name: '??',
          mssg: payload.mssg,
          seen: payload.seen,
          reached: payload.reached,
        }

        let name = '??';
        
        if (state.conversations.length > 0 && state.conversations[0].id === payload.to) {
          name = state.conversations[0].name;
          state.conversations[0] = theFirstConv;
          state.conversations[0].name = name;
          
          return state.conversations;
        } else {

          let newConvArr = [];
          newConvArr.push(theFirstConv);

          state.conversations.forEach((el) => {
            if (el.id !== payload.to) {
              newConvArr.push(el)
            } else {
              name = el.name;
            }
          });
          newConvArr[0].name = name;
          return {conversations: newConvArr}

        }
      }
      case 'updateRASOfConversations': {
        return {
          conversations: state.conversations.map(el => {
            if (el.id === payload.to) {
              if (el.mssg_id === payload.id) {
                let field = (payload.field.includes('seen')) ? 'seen' : 'reached';
                el[field] = true;
              }
            }
            return el;
          }),
        }
      }
      case 'setConvName': {
        if(state.conversations.length > 0 && payload && payload.id && payload.name) {
          if(state.conversations[0].id === payload.id) {
            state.conversations[0].name = payload.name;
            return {conversations: state.conversations}
          } else {
            
            state.conversations.map(el => {
              if (el.id === payload.id) {
                el.name = payload.name;
              }

              return el;
            })
          }
        }
        return state
      }
      default:
        return state
    }
  }
  
  export default conversationsReducer;