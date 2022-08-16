import {FC, useContext} from 'react';
import {Menubar} from 'primereact/menubar';
import {TokenContext} from '../../App';
import {useNavigate} from 'react-router-dom';
import {getRoleFromToken} from '../../utils/jwt-utils';

interface NavbarProps {
}

const Navbar: FC<NavbarProps> = () => {
    const {setToken} = useContext(TokenContext);
    const navigate = useNavigate();

    const logoutItem = {
        label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: () => {
            setToken('');
            localStorage.setItem('jwtToken', '');
            localStorage.setItem('refreshToken', '');
            navigate('/');
        }
    };


    const guestNavbarItems = [
        {
            label: 'Login', icon: 'pi pi-fw pi-sign-in', command: () => {
                navigate('/login');
            }
        },
        {
            label: 'Register', icon: 'pi pi-fw pi-user-plus', command: () => {
                navigate('/register');
            }
        },
    ];

    const adminNavbarItems = [
        {
            label: 'Users', icon: 'pi pi-fw pi-users', command: () => {
            }
        },
        logoutItem
    ];

    const doctorNavbarItems = [
        {
            label: 'Appointments', icon: 'pi pi-fw pi-bookmark', command: () => {
            }
        },
        {
            label: 'Prescriptions', icon: 'pi pi-fw pi-book', command: () => {
            }
        },
        {
            label: 'Statistics', icon: 'pi pi-fw pi-chart-bar', command: () => {
            }
        },
        {
            label: 'Users', icon: 'pi pi-fw pi-users', command: () => {
            }
        },
        {
            label: 'Account', icon: 'pi pi-fw pi-cog', command: () => {
                navigate('/account');
            }
        },
        logoutItem
    ];

    const patientNavbarItems = [
        {
            label: 'Appointments', icon: 'pi pi-fw pi-bookmark', command: () => {
            }
        },
        {
            label: 'Prescriptions', icon: 'pi pi-fw pi-book', command: () => {
            }
        },
        {
            label: 'Calendar', icon: 'pi pi-fw pi-calendar', command: () => {
            }
        },
        {
            label: 'Account', icon: 'pi pi-fw pi-cog', command: () => {
                navigate('/account');
            }
        },
        logoutItem
    ];

    const getNavbarItemsByRole = (role: string) => {
        switch (role) {
            case 'Admin':
                return adminNavbarItems;
            case 'Doctor':
                return doctorNavbarItems;
            case 'Patient':
                return patientNavbarItems;
            default:
                return guestNavbarItems;
        }
    };

    return (
        <div className="card">
            <Menubar
                model={getNavbarItemsByRole(getRoleFromToken(localStorage.getItem('jwtToken') || '') || 'Guest')}
                start={
                    <>{/*TODO Logo here*/}</>
                }
            />
        </div>
    );
};

export default Navbar;