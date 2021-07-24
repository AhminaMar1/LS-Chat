export const messagesOrder = (allMssg) => {

    let mssgArr = [];

    for(let i = 0; i < allMssg.length; i=i+6) {
        let dataStore = {
            id: allMssg[i],
            from: allMssg[i+1],
            mssg: allMssg[i+2],
            sent: true,
            reach: (allMssg[i+3] === 'true' ? true : false),
            seen: (allMssg[i+4] === 'true' ? true : false),
            date: allMssg[i+5]
        }
        mssgArr.push(dataStore);
    }
    return mssgArr;
}