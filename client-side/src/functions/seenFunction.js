export const returnNotSeen = (messages, adminData, chatBoxActive = null) => {

    let needToSeenArr = [];
    for(let i=messages.length-1, finish = false; i>=0 && finish === false; i--) {

        let el = messages[i];
        if(el.from !== adminData.id && el.seen === false) {
            needToSeenArr.push(el.id);
        } else if (el.from !== adminData.id && el.seen === true) {
            finish = true;
        }

    }

    if(needToSeenArr.length > 0) {
        let dataEmit = {
            seen_id: needToSeenArr,
            one_message: needToSeenArr.length === 1 ? true : false,
            checkData: adminData,
            user_id: chatBoxActive,
        }
        return dataEmit;
    }else {
        return false;
    }

}