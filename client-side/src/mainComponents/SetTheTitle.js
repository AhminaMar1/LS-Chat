import React, {useEffect, useMemo} from "react";
 
export default function SetTheTitle({nNotification}) {
    

    const getFaviconEl = useMemo(() => {
        return document.getElementById("favicon");

    }, []);

    useEffect(() => {

        
        if(nNotification === -1) {
            document.title = 'There are new messages || LS-Chat';
            getFaviconEl.href = "https://github.com/AhminaMar1/LS-Chat/blob/main/client-side/public/LSC-notification.ico";
           
        }else if(nNotification){
            document.title = 'There are new '+nNotification+' messages || LS-Chat';
            getFaviconEl.href = "https://github.com/AhminaMar1/LS-Chat/blob/main/client-side/public/LSC-notification";
        } else {
            document.title = 'Live support chat';
            getFaviconEl.href = "https://github.com/AhminaMar1/LS-Chat/blob/main/client-side/public/LSC.ico";
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