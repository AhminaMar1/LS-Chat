export const returnNotSeen = (messages, sessionData, chatBoxActive = null) => {

    let needToSeen;
    for(let i=messages.length-1, finish = false; i>=0 && !finish; i--) {

        let el = messages[i];
        if(el.from !== sessionData.id && el.seen === false) {
            needToSeen = el.id;
            finish = true;
        }

    }

    if(needToSeen) {
        let dataEmit = {
            seen_id: needToSeen,
            one_message: null,
            checkData: sessionData,
            user_id: chatBoxActive,
        }
        return dataEmit;
    }else {
        return false;
    }

}

const theLastOfMeHOF = (messages = [], id, condition) => {
    //We use forloop for best time complexity
    for(let i = messages.length-1; i >= 0; i--) {
        let el = messages[i];
        if(condition(el.from, id)) {
            return el.id;
        }
    }

    return false;
    
}

export const theLastForUser = (messages, id) => {
    
    const condition = (from, id) => {
        return from !== id;
    }

    return theLastOfMeHOF(messages, id, condition);
}

export const theLastForAdmin = (messages, id) => {
    
    const condition = (from, id) => {
        return from !== id;
    }

    return theLastOfMeHOF(messages, id, condition);
}

export const updateMessagesRAS = (messages, data) => {

    let finish = false,
    trueOrFalse = false,
    field = data.field.includes('seen') ? 'seen' : 'reach';
    for(let i = messages.length-1; !finish && i >= 0; i--) { //O(number of messages no reached or no seen) = almost = O(1)
        
        if(messages[i].id === data.id) {
            trueOrFalse = true;
        }

        if (trueOrFalse) {
                if(messages[i][field]) {
                    finish = true;
                } else {
                    messages[i][field] = true;
                    
                }
        }

    }

    return messages;
    
}