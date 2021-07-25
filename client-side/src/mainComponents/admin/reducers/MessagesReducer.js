import {messagesFormat, oneMessageFormat} from '../../../functions/messagesFormat';

const messagesReducer = (state, action = {}) => {
    const { type, payload } = action;

    switch (type) {
      case 'addMessages': {

        return {
          ...state,
          messages: messagesFormat(payload || []),
        }
      }
      case 'addOneMessageFromUser': {
        return {
          ...state,
          messages: [...state.messages, oneMessageFormat(payload || [])],
        }
      }

      default:
        return state
    }
  }
  
  export default messagesReducer;