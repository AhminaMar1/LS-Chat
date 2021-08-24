const getTheCurr = async (userId, User) => {

    let user = await User.findById(userId);

    return user.current_chat_document_id;
}

exports.getChatDoc = async (docId, userId, User, Chat) => {

    docId = docId || await getTheCurr(userId, User);

    if(docId) {
        let chat = await Chat.findById(docId);

        if (userId && chat.user_id === userId) return chat;

    } else {
        return false;
    }
    
    
}