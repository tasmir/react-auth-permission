import React, { useState, ChangeEvent } from 'react';
import {logout} from "./Auth/AuthProvider";

const Logout = () => {


    const onSubmit = (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault();
            var requestOptions = {
                method: 'POST',
                redirect: 'follow'

            };

            fetch("http://localhost/laravel/accounts_api/public/api/auth/logout", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
            logout();
        }
    };

    return <form onSubmit={onSubmit}>
        <button type={"submit"}>Submit</button>
    </form>
};
export default Logout;