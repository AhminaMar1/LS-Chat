const { v4: uuid, validate: uuidValidate } = require('uuid');

exports.messageFormat = ({id, message, sender}) => {
    
    let validUuid = uuidValidate(id);
    let now = new Date();

    let messageFormat = {
        id: (validUuid) ? id : uuid(),
        sender_id: sender,
        mssg: message,
        date: now
    }

    return [messageFormat, now];
}

exports.formatSroreInRedis = ({id, sender, message, now}) => {
    
    let arr = [id, sender, message, false, false, now];

    return arr;


}