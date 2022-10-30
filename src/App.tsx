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
import ConfirmEmail from "./pages/Auth/ConfirmEmail";
import NewPassword from "./pages/Auth/NewPassword";
import PasswordReset from "./pages/Auth/PasswordReset";
import PatientDetails from "./pages/Users/Patient/PatientDetails/PatientDetails";
import DoctorDetails from "./pages/Users/Doctor/DoctorDetails/DoctorDetails";


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
                        <Route path="/register" element={<Register redirectTo="/login"/>}/>
                        <Route path="/confirm-email" element={<ConfirmEmail redirectTo="/login"/>}/>
                        <Route path="/password-reset" element={<PasswordReset redirectTo="/login"/>}/>
                        <Route path="/password-reset/new" element={<NewPassword redirectTo="/login"/>}/>

                        <Route element={<ProtectedRoute allowedRoles={['Doctor']}/>}>
                            <Route path="/appointments/:id/edit" element={<AppointmentEdit/>}/>
                            <Route path="/appointments/:id" element={<ManageAppointment/>}/>

                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={['Patient', 'Doctor']}/>}>
                            <Route path="/appointments" element={<AppointmentsTable/>}/>
                            <Route path="/account" element={<AccountManagement/>}/>
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={['Admin', 'Doctor']}/>}>
                            <Route path="/users" element={<UserManagement/>}/>
                            <Route path="/patients/:id" element={<PatientDetails/>}/>
                            <Route path="/doctors/:id" element={<DoctorDetails/>}/>
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
