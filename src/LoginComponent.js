import React, { useState, ChangeEvent } from 'react';
import {login} from "./Auth/AuthProvider";
import {Redirect} from "react-router-dom";

const LoginComponent = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const onChange = ({target: {name, value}}: ChangeEvent<HTMLInputElement>) => {
        setCredentials({...credentials, [name]: value})
    };

    const onSubmit = (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault();
        }

        var formdata = new FormData();
        formdata.append("email", credentials.email);
        formdata.append("password", credentials.password);

        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
        };

        fetch(`${process.env.REACT_APP_BASE_URL}auth/login`, requestOptions)
            .then(response => response.text())
            // .then(result => console.log(result))
            .then(token => {
                let t = JSON.parse(token);
                // console.log(t.access_token);
                document.cookie="token="+t.access_token;
                login(token)
            })
            // .then(window.location.reload())
            .catch(error => console.log('error', error));





        // fetch(process.env.REACT_APP_BASE_URL+'auth/login', {
        //     method: 'POST',
        //     body: JSON.stringify(credentials)
        // })
        //     .then(r => r.json())
        //     .then(token => login(token))
    };

    return <form onSubmit={onSubmit}>
        <input name="email"
               value={credentials.email}
               onChange={onChange}/>
        <input name="password"
               value={credentials.password}
               onChange={onChange}/>
        <button type={"submit"}>Submit</button>
    </form>
};
export default LoginComponent;