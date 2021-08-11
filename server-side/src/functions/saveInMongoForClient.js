//create a new chat-document
saveNewChatFun = async (Chat, userDocumentId, prevChatId) => {

    const chat = new Chat({
        user_id : userDocumentId,
        prev_documet_id: prevChatId
    })
    try {


        const saveChate = await chat.save();

        return (saveChate._id);

    } catch (err) {
        return false;
    }

}

///// start session - client
exports.saveNewSession = async (User, Chat, res) => {
    // random name
    const names = ['Chai', 'Robin', 'Lofi', 'Soku', 'Yori', 'Ham'];
    const leng = names.length;
    
    const randomName = () => {
        let randIndex = Math.floor(Math.random()* leng)
        
        return names[randIndex] + Math.floor(Math.random()* 1000);
    }
    // random token
    const randChars = () => {
        return Math.random().toString(36).substr(2);
    };
    
    const token = () => {
        return randChars() + randChars(); // to make it longer
    };
    
    //Create new session - new user
    const user = new User({
        random_name: randomName(),
        token: token(),
        current_chat_document_id: null

    })
    try {


        let newSession = await user.save();

        let currentChatId = await saveNewChatFun(Chat, newSession._id, null);
        if (currentChatId) {
            newSession.current_chat_document_id = currentChatId;
            await newSession.save();
        }

        //result to return it
        const resultat = {
            _id: newSession._id,
            random_name: newSession.random_name,
            token: newSession.token,
            curr_chat_doc_id: newSession.current_chat_document_id,
            already: false
        }
        //new session - 201 status
        res.status(201).json(resultat)
    } catch (err) {
        //Error status
        res.status(400).json({ message: err.message })
    }
}

exports.saveNewChat = saveNewChatFun;