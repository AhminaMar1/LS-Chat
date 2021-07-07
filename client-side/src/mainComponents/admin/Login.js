import React, {useState} from 'react';
import '../../styles/login.scss';

export default function Login(){
    
    //DemoAccount to test the app
    const usernameDemo = 'demoaccount';
    const passwordDemo = 'demoaccount';

    //Styles
    const toggleLCOpenStyle = {
        'transform' : 'translateX(0%)'
    }

    const toggleLCCloseStyle = {
        'transform' : 'translateX(-100%)',
    }

    const toggleIconOpenStyle = {
        'transform' : 'rotate(0deg)'
    }

    const toggleIconCloseStyle = {
        'transform' : 'rotate(180deg)',
    }

    //States - HOOKS
    const [toggleLC, setToggleLC] = useState(true);
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');


    //onClick functions
    const initUsername = () => {
        setUsernameInput(usernameDemo);
    }

    const initPassword = () => {
        setPasswordInput(passwordDemo);
    }

    const initLogin = () => {
        initUsername();
        initPassword();
    }

    //onChange functions

    const changeUsernameInput = (e) => {
        let value = e.target.value;
        setUsernameInput(value);
    }

    const changePasswordInput = (e) => {
        let value = e.target.value;
        setPasswordInput(value);
    }


    return(
        <div className="login-main-container">
            <section className="login-section">
                <div className="login-container">
                    <h1>Login</h1>
                    <div className="input-group">
                        <label htmlFor="username" className="hidden-label">Username</label>
                        <input id="username" type="text" value={usernameInput} onChange={changeUsernameInput} placeholder="Username" name="username" />
                        <div className="check"><i className="fas fa-check-circle" /></div>
                    </div>
                    <div className="input-group">
                        <label htmlFor="password" className="hidden-label">Password</label>
                        <input id="password" type="password" value={passwordInput} onChange={changePasswordInput} placeholder="Password" name="password" />
                        <div className="check"><i className="fas fa-check-circle" /></div>

                    </div>
                    <button>login</button>
                </div>
            </section>

            <div id="login-card" className="login-card" style={(toggleLC)? toggleLCOpenStyle : toggleLCCloseStyle }>
                <div className="login-inf-part">
                    <h2>Welcome to support-chat</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure sed vel laboriosam quisquam expedita
                        <span onClick={initUsername} className="span-to-copy">username</span>
                        and
                        <span onClick={initPassword} className="span-to-copy">password</span>
                        <br />
                        pariatur veritatis suscipit. Voluptas!</p>
                    <div onClick={initLogin} className="click-here">or click here</div>
                </div>
                <span className="close" onClick={() => setToggleLC(s => !s)}>
                    <span className="close-icon">
                        <i className="fas fa-angle-left" style={(toggleLC)? toggleIconOpenStyle : toggleIconCloseStyle } />
                    </span>
                </span>
            </div>
        </div>
    );
}