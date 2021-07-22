import React, {useState, useEffect} from 'react';
import '../../styles/login.scss';
import axios from 'axios';
import env from "react-dotenv";
import Wait from './components/Wait';
import FlashMessage from './components/FlashMessage'


const API_URL = env.API_URL;
const inputsWrong = "the username or the password is wrong";
export default function Login(){


    //apiURL

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
    const [statusLogin, setStatusLogin] = useState(true);
    const [hidAll, setHidall] = useState(true);


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

    //

    const redirectToAdminHome = () => {
        window.location.href = '/admin';
    }

    //Login test

    const sendToLogin = () => {
        const data = {
            username: usernameInput,
            password: passwordInput
        }

        axios.post(`${API_URL}/admin/login`, data)
        .then(res => {
            let success = res.data.success_login;
            console.log(res)
            if (success === false) {
                setStatusLogin(false);
                setHidall(false);
            } else if (success === true) {
                localStorage.setItem('ltc_admin_id', res.data.id);
                localStorage.setItem('ltc_admin_token', res.data.token);
                setStatusLogin(true);

                redirectToAdminHome();

            }

        }).catch(err => {
            console.log(err);
            setHidall(false);
        });
    }

    // Send POST api to check the id and the token that store in localStorage
    const testToken = (id, token) => {
        //Send POST axios

        return true;
    }

    //Check first if there are a session in localStorage
    useEffect( () => {
        let id = localStorage.getItem('ltc_admin_id');
        let token = localStorage.getItem('ltc_admin_token');

        if(id && token) {
            //Call testToken function
            // TODO: Complete the function and add the Async
            let testingOfToken = testToken(id, token);

            if(testingOfToken) {
                redirectToAdminHome();
            }else {
                setHidall(false);
            }

        }else {
            setHidall(false);
        }

    }, []);

    
    return(
        <>
            {hidAll ? <Wait /> : ''}
            <div className="login-main-container" style={hidAll ? {display: 'none'} : {display: 'block'}}>
                { (statusLogin === false) ? <FlashMessage toHid={setStatusLogin} newToHidState={true} message={inputsWrong} /> : ''}
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
                        <button onClick={sendToLogin}>login</button>
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
        </>
    );
}