import React, {Dispatch, SetStateAction, useEffect} from 'react';
import './App.css';
import Layout from './components/Layout/Layout';
import {isTokenExpired} from './utils/jwt-utils';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AppointmentEdit from './pages/Appointments/AppointmentEdit';
import AccountManagement from './pages/AccountManagement/AccountManagement';
import ManageAppointment from "./pages/Appointments/ManageAppointment/ManageAppointment";
import UserManagement from "./pages/Users/UserManagement/UserManagement";
import AddDoctor from "./pages/Users/AddDoctor";
import AppointmentsTable from "./pages/Appointments/AppointmentsTable/AppointmentsTable";


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

                        <Route element={<ProtectedRoute allowedRoles={['Doctor']}/>}>
                            <Route path="/appointments/:id/edit" element={<AppointmentEdit/>}/>
                            <Route path="/appointments/:id" element={<ManageAppointment/>}/>
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={['Patient', 'Doctor']}/>}>
                            <Route path="/appointments" element={<AppointmentsTable/>}/>
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={['Patient', 'Doctor']}/>}>
                            <Route path="/account" element={<AccountManagement/>}/>
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={['Admin', 'Doctor']}/>}>
                            <Route path="/users" element={<UserManagement/>}/>
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={['Admin']}/>}>
                            <Route path="/doctors/add" element={<AddDoctor/>}/>
                        </Route>
                    </Routes>
                </Layout>
            </BrowserRouter>
        </TokenContext.Provider>
    );
}

export default App;
