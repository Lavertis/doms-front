import {FC} from 'react';
import {Menubar} from 'primereact/menubar';
import {useNavigate} from 'react-router-dom';
import userStore from "../../../store/user-store";
import {observer} from "mobx-react-lite";

interface NavbarProps {
}

const Navbar: FC<NavbarProps> = () => {
    const navigate = useNavigate();

    const logoutItem = {
        label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: () => {
            userStore.logout()
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
            label: 'Users', icon: 'pi pi-fw pi-users',
            items: [
                {
                    label: 'User management', icon: 'pi pi-fw pi-cog', command: () => {
                        navigate('/users');
                    }
                },
                {
                    label: 'Add doctor', icon: 'pi pi-fw pi-plus', command: () => {
                        navigate('/doctors/add');
                    }
                }
            ],

        },
        logoutItem
    ];

    const doctorNavbarItems = [
        {
            label: 'Appointments', icon: 'pi pi-fw pi-bookmark', command: () => {
                navigate('/appointments');
            }
        },
        {
            label: 'Statistics', icon: 'pi pi-fw pi-chart-bar', command: () => {
            }
        },
        {
            label: 'Users', icon: 'pi pi-fw pi-users', command: () => {
                navigate('/users');
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
                navigate('/appointments');
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
                model={getNavbarItemsByRole(userStore.user?.role || 'Guest')}
                start={
                    <>{/*TODO Logo here*/}</>
                }
            />
        </div>
    );
};

export default observer(Navbar);