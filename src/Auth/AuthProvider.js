import React, {useState, useEffect} from 'react';
import {Redirect} from "react-router-dom";

const createTokenProvider = () => {

    /* Implementation */
    let _token = (accessToken, refreshToken) =>
        JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH') || '') || null;

    const getExpirationDate = (jwtToken) => {
        if (!jwtToken) {
            return null;
        }

        const jwt = JSON.parse(atob(jwtToken.split('.')[1]));

        // multiply by 1000 to convert seconds into milliseconds
        return jwt && jwt.exp && jwt.exp * 1000 || null;
    };

    const isExpired = (exp) => {
        if (!exp) {
            return false;
        }

        return Date.now() > exp;
    };


    const getToken = async () => {
        if (!_token) {
            return null;
        }

        if (isExpired(getExpirationDate(_token.accessToken))) {
            const updatedToken = await fetch(`${process.env.REACT_APP_BASE_URL}auth/refresh`, {
                method: 'POST',
                body: _token.refreshToken
            })
                .then(r => r.json());

            setToken(updatedToken);
        }

        return _token && _token.accessToken;
    };


    const isLoggedIn = () => {
        if(JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH') || false)){
            return !!_token;
        } else {
            return false;
        }
    };


    let observers: Array<(isLogged: boolean) => void> = [];


    const subscribe = (observer: (isLogged) => void) => {
        observers.push(observer);
    };


    const unsubscribe = (observer: (isLogged: boolean) => void) => {
        observers = observers.filter(_observer => _observer !== observer);
    };


    const notify = () => {
        const isLogged = isLoggedIn();
        observers.forEach(observer => observer(isLogged));
    };


    const setToken = (token: typeof _token) => {
        if (token) {
            localStorage.setItem('REACT_TOKEN_AUTH', JSON.stringify(token));
        } else {
            localStorage.removeItem('REACT_TOKEN_AUTH');
        }
        _token = token;
        notify();
    };

    const userToken = () => {
        if (isLoggedIn) {
            return JSON.parse(_token()).access_token;
        }
    }
    return {
        getToken,
        isLoggedIn,
        setToken,
        subscribe,


    };
};


export const createAuthProvider = () => {

    /* Implementation */
    const tokenProvider = createTokenProvider();

    const login: typeof tokenProvider.setToken = (newTokens) => {
        // document.cookie="token="+newTokens;

        tokenProvider.setToken(newTokens);
    };

    const logout = () => {
        tokenProvider.setToken(null);
    };


    const authFetch = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
        const token = await tokenProvider.getToken();

        init = init || {};

        init.headers = {
            ...init.headers,
            Authorization: `Bearer ${token}`,
        };

        return fetch(input, init);
    };


    const useAuth = () => {
        const [isLogged, setIsLogged] = useState(tokenProvider.isLoggedIn());

        useEffect(() => {
            const listener = (newIsLogged: boolean) => {
                setIsLogged(newIsLogged);
            };

            tokenProvider.subscribe(listener);
            return () => {
                tokenProvider.unsubscribe(listener);
            };
        }, []);

        // return [isLogged] , as [typeof isLogged];
        return [isLogged, typeof isLogged];
    };

    const getTokenC = () => {
        const cookieValue = document.cookie;
        const token = cookieValue.split('token=');
        return token[1];
    }

    const Permissions = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + getTokenC()
            }
        };

            fetch(`${process.env.REACT_APP_BASE_URL}auth/user-permission`, requestOptions)
                .then(response => response.json())
                .catch(error => console.log('error', error));

    }

    const MyComponent = () => {
        const [error, setError] = useState(null);
        const [isLoaded, setIsLoaded] = useState(false);
        const [items, setItems] = useState([]);

        // Note: the empty deps array [] means
        // this useEffect will run once
        // similar to componentDidMount()
        useEffect(() => {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow',
                headers: {
                    'Authorization': 'Bearer ' + getTokenC()
                }
            };

            fetch(`${process.env.REACT_APP_BASE_URL}auth/user-permission`, requestOptions)
                .then(res => res.json())
                .then(
                    (result) => {
                        setIsLoaded(true);
                        setItems(result);
                    },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {
                        setIsLoaded(true);
                        setError(error);
                    }
                )
        }, []);

        let per = '';
        items.map(imap => (
            // per.push(imap.name)
            per = per+`${imap.name},`
            ));

        // let x =  JSON.parse(localStorage.REACT_TOKEN_AUTH);
        // let y = JSON.parse(x);
        // console.log(y.access_token);
        // localStorage.removeItem('REACT_TOKEN_AUTH');
        // console.log(window.localStorage.getItem('REACT_TOKEN_AUTH'));
        // console.log(localStorage);

        return per;

        // return (
        //     <ul>
        //         {items.map(item => (
        //             <li key={item.id}>
        //                 {item.name}
        //             </li>
        //         ))}
        //     </ul>
        // );
    }

    return {
        useAuth,
        authFetch,
        login,
        logout,
        Permissions,
        MyComponent
    }
};

export const {useAuth, authFetch, login, logout, Permissions, MyComponent} = createAuthProvider();