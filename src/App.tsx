import React, {Dispatch, SetStateAction, useEffect} from 'react';
import './App.css';
import Layout from './components/Layout/Layout';
import {isTokenExpired} from './utils/jwt-utils';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

export const TokenContext = React.createContext<{ token: string; setToken: Dispatch<SetStateAction<string>>; }>(
    {
        token: '',
        setToken: () => {
        }
    }
);

function App() {
    const [token, setToken] = React.useState<string>(localStorage.getItem('jwtToken') ?? '');

    useEffect(() => {
        const checkToken = () => {
            if (!token) {
                return;
            }
            if (isTokenExpired(token)) {
                localStorage.removeItem('jwtToken');
                setToken('');
            }
        };
        checkToken();
    }, [token]);

    return (
        <TokenContext.Provider value={{token, setToken}}>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/login" element={<Login redirectTo="/"/>}/>
                        <Route path="/register" element={<Register redirectTo="/"/>}/>
                    </Routes>
                </Layout>
            </BrowserRouter>
        </TokenContext.Provider>
    );
}

export default App;
