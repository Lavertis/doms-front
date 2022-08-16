import React, {Dispatch, SetStateAction, useEffect} from 'react';
import './App.css';
import Layout from './components/Layout/Layout';
import {isTokenExpired} from './utils/jwt-utils';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AccountManagement from './pages/AccountManagement/AccountManagement';
import ProtectedRoute from './components/Auth/ProtectedRoute';


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

                        <Route element={<ProtectedRoute allowedRoles={['Patient', 'Doctor']}/>}>
                            <Route path="/account" element={<AccountManagement/>}/>
                        </Route>
                    </Routes>
                </Layout>
            </BrowserRouter>
        </TokenContext.Provider>
    );
}

export default App;
