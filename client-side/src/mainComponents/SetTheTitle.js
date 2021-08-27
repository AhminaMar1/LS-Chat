import React, {useEffect, useMemo} from "react";
 
export default function SetTheTitle({nNotification}) {
    

    const getFaviconEl = useMemo(() => {
        return document.getElementById("favicon");

    }, []);

    useEffect(() => {

        
        if(nNotification === -1) {
            document.title = 'There are new messages || LS-Chat';
            getFaviconEl.href = window.location.origin+"/LSC-notification.ico";
           
        }else if(nNotification){
            document.title = 'There are new '+nNotification+' messages || LS-Chat';
            getFaviconEl.href = window.location.origin+"/LSC-notification.ico";
        } else {
            document.title = 'Live support chat';
            getFaviconEl.href = window.location.origin+"/LSC.ico";
        }
    
    }, [nNotification, getFaviconEl]);

    return (
        <div>
            {
            /*
                LS-CHAT - Live support chat
                Made with love by *AhminaMar1*
                Email: *AhminaMar1@gmail.com*
            */
            }
        </div>
    );
};