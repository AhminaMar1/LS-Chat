import React, {useState} from 'react'

export default function SendMessage({sendMessage}) {
    const [clickShift, setClickShift] = useState(false);
    const [allowChange, setAllowChange] = useState(true);
    const [newMessageHere, setNewMessageHere] = useState(''); //To best practise

    //Functions
    const handleChange = (e) => {
        if(allowChange){
            setNewMessageHere(e.target.value);
        }else{
            setAllowChange(true);
        }
    }

    const sendMessageFun = () => {
        sendMessage(newMessageHere);
        setNewMessageHere('');
    }

    const handleKeyDown = (e) => {
        if (!clickShift && e.keyCode === 16) { //shift
            setClickShift(true);
        } else if (!clickShift && e.keyCode === 13) {
            if(newMessageHere!==''){
                sendMessageFun();
            }
            setAllowChange(false);
        } else if (clickShift) {
            setClickShift(false);
        }
    
    }

    return (
        <div className="input-group">
            <div className="button-flex">
                <button><i className="far fa-paper-plane" /></button>
            </div>
            <textarea name="message" value={newMessageHere} onKeyDown={handleKeyDown} onChange={(e) => handleChange(e)}></textarea>
        </div>
    )
}
