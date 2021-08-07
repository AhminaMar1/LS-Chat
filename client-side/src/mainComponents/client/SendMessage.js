import React, {useState, useCallback, useRef, useLayoutEffect} from 'react'

export default function SendMessage({sendMessage, setFocus}) {

    //Ref
    const refInput = useRef(null);
    //States
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

    const switchFocusToTrue = useCallback( ()=> {
        setFocus(true);
    }, [setFocus])

    const switchFocusToFalse = useCallback( ()=> {
        setFocus(false);
    }, [setFocus])

    useLayoutEffect (() => {


        refInput.current.addEventListener('focusin', switchFocusToTrue);

        refInput.current.addEventListener('focusout', switchFocusToFalse);
        
        //To debugging an eslint err
        let checkRefCurrent = null;
        if (refInput.current) {
            checkRefCurrent = refInput.current;
        }

        return () => {
            checkRefCurrent.removeEventListener('focusin', switchFocusToTrue)
            checkRefCurrent.addEventListener('focusout', switchFocusToFalse);
        }
    }, [switchFocusToTrue, switchFocusToFalse]);

    return (
        <div className="input-group">
            <div className="button-flex">
                <button><i className="far fa-paper-plane" /></button>
            </div>
            <textarea name="message" ref={refInput} value={newMessageHere} onKeyDown={handleKeyDown} onChange={(e) => handleChange(e)}></textarea>
        </div>
    )
}
