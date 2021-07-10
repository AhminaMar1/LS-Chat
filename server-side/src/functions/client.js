///// start session - client
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
exports.saveNewSession = async (User, res) => {
    
    //Create new session - new user
    const user = new User({
        random_name: randomName(),
        token: token()

    })
    try {


        const newSession = await user.save();
        //result to return it
        const resultat = {
            _id: newSession._id,
            random_name: newSession.random_name,
            token: newSession.token,
            already: false
        }
        //new session - 201 status
        res.status(201).json(resultat)
    } catch (err) {
        //Error status
        res.status(400).json({ message: err.message })
    }
}
