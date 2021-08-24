import {oneMessageFormat, messagesFormatFromMongo} from '../../../functions/messagesFormat';
import {updateMessagesRAS} from '../../../functions/seenAndRechedFunctions';

const messagesReducer = (state, action = {}) => {
    const { type, payload } = action;
    
    switch (type) {
      case 'addMessages': {

        return {
          messages: payload,
        }
      }
      case 'addMessagesFromMongo': {

        return {
          messages: [...messagesFormatFromMongo(payload), ...state.messages],
        }
      }
      case 'addOneMessageFromUser': {
        return {
          messages: [...state.messages, oneMessageFormat(payload, [true, true, false])],
        }
      }
      case 'addOneMessageFromAdmin': {
        let id = payload.id || false;
        let existe = state.messages.some(el => el.id === id)
        if (existe) {
          return {messages: state.messages.map(el => {
            if (el.id === payload.id) {
              el.sent = true;
            }
            return el;
          })};
        } else {
          return {
            messages: [...state.messages, oneMessageFormat(payload, [true, false, false])],
          }
        }
      }
      case 'addOneMessageFromMe': {
        return {
          messages: [...state.messages, oneMessageFormat(payload, [false, false, false])],
        }

      }
      case 'reachedAndSeenDispatch': {        
        return {
          messages: updateMessagesRAS(state.messages, payload)
        }
      }
      default:
        return state
    }
  }
  
  export default messagesReducer;