import React, {useEffect, useState} from 'react';
import './App.css';
import Layout from './components/Layout/Layout';
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
import userStore from "./store/user-store";
import {observer} from "mobx-react-lite";
import PatientPrescriptionHistory from "./pages/Prescriptions/PatientPrescriptionHistory";
import {ProgressSpinner} from "primereact/progressspinner";
import AppointmentSettings from "./pages/Settings/AppointmentSettings/AppointmentSettings";
import {Roles} from "./enums/Roles";


function App() {
    const [content, setContent] = useState(
        <div className="bg-indigo-50" style={{minHeight: '100vh', position: 'relative'}}>
            <ProgressSpinner
                style={{
                    position: 'absolute',
                    margin: 'auto',
                    left: '0',
                    right: '0',
                    top: '0',
                    bottom: '0',
                    textAlign: 'center'
                }}
            />
        </div>
    );

    const setAppContent = () => {
        setContent(
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/login" element={<Login redirectTo="/"/>}/>
                        <Route path="/register" element={<Register redirectTo="/login"/>}/>
                        <Route path="/confirm-email" element={<ConfirmEmail redirectTo="/login"/>}/>
                        <Route path="/password-reset" element={<PasswordReset redirectTo="/login"/>}/>
                        <Route path="/password-reset/new" element={<NewPassword redirectTo="/login"/>}/>

                        <Route element={<ProtectedRoute allowedRoles={[Roles.Doctor]}/>}>
                            <Route path="/appointments/:id/edit" element={<AppointmentEdit/>}/>
                            <Route path="/settings/appointment" element={<AppointmentSettings/>}/>
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={[Roles.Patient, Roles.Doctor]}/>}>
                            <Route path="/appointments" element={<AppointmentsTable/>}/>
                            <Route path="/account" element={<AccountManagement/>}/>
                            <Route path="/appointments/:id" element={<ManageAppointment/>}/>
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={[Roles.Patient]}/>}>
                            <Route path="/prescriptions" element={<PatientPrescriptionHistory/>}/>
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={[Roles.Admin, Roles.Doctor]}/>}>
                            <Route path="/users" element={<UserManagement/>}/>
                            <Route path="/patients/:id" element={<PatientDetails/>}/>
                            <Route path="/doctors/:id" element={<DoctorDetails/>}/>
                        </Route>

                        <Route element={<ProtectedRoute allowedRoles={[Roles.Admin]}/>}>
                            <Route path="/doctors/add" element={<AddDoctor/>}/>
                        </Route>
                    </Routes>
                </Layout>
            </BrowserRouter>
        );
    }

    useEffect(() => {
        userStore.refreshToken().then(setAppContent, setAppContent);
    }, []);

    return content;
}

export default observer(App);
