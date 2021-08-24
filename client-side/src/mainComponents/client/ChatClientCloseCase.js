import React, {useState, useEffect, useCallback, useRef} from 'react'

export default function ChatClientCloseCase({avatar, setToggleState}) {

    const elRefChatClient = useRef(null);
    const [useEffectDidMount, setUseEffectDidMount] = useState(false);
    const [mouseUp, setMouseUp] = useState(false);
    const [elPositin, setElPosition] = useState({
        x: 10,
        y: 10
    });
    const [diffMouse, setDiffMouse] = useState({diffX: 0, diffY:0});
    const [moving, setMoving] = useState(false);

    const moveHandle=useCallback((e) => {
        e = e || window.event;
        let x = e.clientX - diffMouse.diffX;
        let y = e.clientY - diffMouse.diffY;

        setElPosition({x, y})

        if(!moving) setMoving(true);

        }, [diffMouse, moving])

    const handleMouseUp = (e) => {
        e = e || window.event;
        let diffX = e.clientX - elPositin.x;
        let diffY = e.clientY - elPositin.y;
        
        setDiffMouse({
            diffX,
            diffY
        });
        setMouseUp(true);
    }

    const saveInLocalStorage = useCallback( () => {
        let obj = {"x": elPositin.x, "y": elPositin.y}
        localStorage.setItem('el_position', JSON.stringify(obj));
    }, [elPositin])

    const handleOpenClick = () =>{
        if (mouseUp && moving) {
            setMouseUp(false);
            setMoving(false);
        } else {
            saveInLocalStorage();
            setToggleState(true);
        }
    }

    useEffect(() => {
        
        let XYFromStorage = localStorage.getItem('el_position');
        let x, y;
        if (XYFromStorage) {

            XYFromStorage = JSON.parse(XYFromStorage);

            x = XYFromStorage.x;
            y = XYFromStorage.y;
            
            x = (x >= 0) ? x : 0;
            y = (y >= 0) ? y : 0;
            
            setElPosition({x, y}); //Set mousePosition from the localStorage 

        } else {
            //Get position of "elRefChatClient"
            
            y = elRefChatClient.current.offsetTop || 10;
            x = elRefChatClient.current.offsetLeft || 10;
     
            setElPosition({x, y}); //Set current mousePosition (Initial state)
        }
        
        let windowW = window.innerWidth,
            windowH = window.innerHeight,
            elementW = Math.floor(elRefChatClient.current.offsetWidth/10),
            elementH = Math.floor(elRefChatClient.current.offsetHeight/10);

        
        //If the element is out of the window        
        if (x<0 || y<0 || x+elementW>windowW || y+elementH>windowH) setElPosition({x: 10, y: 10});
        
        setUseEffectDidMount(true); //Allow to put mousePosition as a style.

    },[]);

    useEffect(() => {
        
        if(mouseUp) window.addEventListener('mousemove', moveHandle);

        return () => window.removeEventListener('mousemove', moveHandle);

    }, [moveHandle ,mouseUp]);


    return (
        <div className="chat-client-close-case-container" style={(useEffectDidMount)?{top: elPositin.y, left: elPositin.x}:{opacity: 0}}>
            <div className="zoom-animate">
                <div ref={elRefChatClient} onMouseDown={(e)=>handleMouseUp(e)} onClick={()=>handleOpenClick()} className="chat-client-close-case noselect">
                    <div className="notification"><div><span>0</span></div></div>
                    <img src={avatar} alt="admin pic" draggable="false" />
                </div>
            </div>
        </div>
    )
}