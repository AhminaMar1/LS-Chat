const setNewCurrDocIdInUserDoc = (getTheUser, theNewCurr) => {
    getTheUser.current_chat_document_id = theNewCurr;
    getTheUser.save();
}

const setNewNewDocIdInChatDoc = async (chatId, ChatModel, theNewNew) => {
    
    const chathDoc = await ChatModel.findById(chatId);
    if (chathDoc) {
        chathDoc.next_documet_id = theNewNew;
        chathDoc.save();
    }
    
}

//create a new chat-document
exports.saveNewChat = async (userId, UserModel, ChatModel, messages) => {
    const getTheUser = await UserModel.findById(userId);
    
    if(getTheUser) {
        
        let curr = getTheUser.current_chat_document_id || null;
        
        const newChat = new ChatModel({
            user_id : userId,
            prev_documet_id: curr,
            next_documet_id: null,
            messages: messages
        })
        try {
            
            const saveChat = await newChat.save();
                            
            setNewCurrDocIdInUserDoc(getTheUser, saveChat._id);
            
            if (curr) {
                setNewNewDocIdInChatDoc(curr, ChatModel, saveChat._id);
            }
    
        } catch (err) {
            return false;
        }
   
    }

}

//Get the current chat_id // use this just after checking the client 



///// start session - client
exports.saveNewSession = async (User, res) => {
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

