import React, {useEffect, useState} from 'react';
import NormalScreen from './AdminNormalScreen';
import SmallScreen from './AdminSmallScreen';


function Admin() {

  const [windowWidth, setWindowWidth] = useState(1400);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', ()=>{
      setWindowWidth(window.innerWidth);
    });
  }, []);

  return (
    <div>
      {windowWidth>1000?<NormalScreen />:<SmallScreen />}
    </div>
  );
}

export default Admin;
