export const messagesFormat = (allMssg = [], {my_seen = null, admin_seen, my_reached, admin_reached}, idUser = null, idUserFromAdmin = null) => {
    
    let mssgArr = [];
    let seen = (my_seen || admin_seen) ? true : false,
        reached = (my_reached || admin_reached) ? true : false,
        timesSeen = 0,
        timesReached = 0;
    for(let i = 0; i < allMssg.length; i=i+4) {
        let dataStore = {
            id: allMssg[i],
            from: allMssg[i+1],
            mssg: allMssg[i+2],
            sent: true,
            reach: (allMssg[i+1] === idUser) ? null : (allMssg[i+1] === idUserFromAdmin) ? true : reached,
            seen: (allMssg[i+1] === idUser) ? null : seen,
            date: allMssg[i+3]
        }
        mssgArr.push(dataStore);
        if(allMssg[i] === my_seen || allMssg[i] === admin_seen) {
            if (my_seen === null || timesSeen > 0) {
                seen = false;
            }
            timesSeen++;
        }

        if(allMssg[i] === my_reached || allMssg[i] === admin_reached) {
            if (timesReached > 0 || (!my_seen)) {
                reached = false;
            }
            timesReached++;
        }

    }
    return mssgArr;
}

export const oneMessageFormat = (data, [sent = false, reach = false, seen = false]) => {

    let dataStore = {
        id: data.id,
        from: data.sender_id,
        mssg: data.mssg,
        sent,
        reach,
        seen,
        date: data.date
    }

    return dataStore;
}