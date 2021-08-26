import React, {useEffect, useMemo} from "react";
 
export default function SetTheTitleHelmet({nNotification}) {
    

    const getFaviconEl = useMemo(() => {
        return document.getElementById("favicon");

    }, []);

    useEffect(() => {

        
        if(nNotification){
            document.title = 'There are '+nNotification+' new messages || LS-Chat';
            getFaviconEl.href = "https://github.com/AhminaMar1/LS-Chat/blob/main/client-side/public/logo2.png";
        } else {
            document.title = 'Live support chat';
            getFaviconEl.href = "https://github.com/AhminaMar1/LS-Chat/blob/main/client-side/public/logo.png";
        }
    
    }, [nNotification, getFaviconEl]);

    return (
        <div>
            {
            /*
                LS-CHAT : Live support chat

            */
            }
        </div>
    );
};