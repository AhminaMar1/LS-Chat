const { v4: uuid, validate: uuidValidate } = require('uuid');

exports.messageFormat = ({id, message, sender, date}) => {
    
    let validUuid = uuidValidate(id);

    let messageFormat = {
        id: (validUuid) ? id : uuid(),
        sender_id: sender,
        mssg: message,
        date
    }

    return messageFormat;
}

exports.formatSroreInRedis = ({id, sender, message, date = 'no-date'}) => {
    
    let arr = [id, sender, message, date];

    return arr;


}