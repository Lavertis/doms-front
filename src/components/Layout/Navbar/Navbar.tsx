import {FC} from 'react';
import {Menubar} from 'primereact/menubar';
import {useNavigate} from 'react-router-dom';
import userStore from '../../../store/user-store';
import {observer} from 'mobx-react-lite';
import {Roles} from '../../../enums/Roles';

interface NavbarProps {
}

const Navbar: FC<NavbarProps> = () => {
    const navigate = useNavigate();

    const logoutItem = {
        label: 'Logout', icon: 'pi pi-fw pi-sign-out', command: () => {
            userStore.logout();
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
        {
            label: 'Statistics', icon: 'pi pi-fw pi-chart-bar', command: () => {
                navigate('/statistics');
            }
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
                navigate('/statistics');
            }
        },
        {
            label: 'Timetable', icon: 'pi pi-fw pi-calendar', command: () => {
                navigate('/timetable');
            }
        },
        {
            label: 'Users', icon: 'pi pi-fw pi-users', command: () => {
                navigate('/users');
            }
        },
        {
            label: 'Settings', icon: 'pi pi-fw pi-cog', items: [
                {
                    label: 'Account', icon: 'pi pi-fw pi-users', command: () => {
                        navigate('/account');
                    }
                },
                {
                    label: 'Appointment', icon: 'pi pi-fw pi-calendar', command: () => {
                        navigate('/settings/appointment');
                    }
                }
            ]
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
                navigate('/prescriptions');
            }
        },
        {
            label: 'Sick leaves', icon: 'pi pi-fw pi-file', command: () => {
                navigate('/sick-leaves');
            }
        },
        {
            label: 'Timetable', icon: 'pi pi-fw pi-calendar', command: () => {
                navigate('/timetable');
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
            case Roles.Admin:
                return adminNavbarItems;
            case Roles.Doctor:
                return doctorNavbarItems;
            case Roles.Patient:
                return patientNavbarItems;
            default:
                return guestNavbarItems;
        }
    };

    return (
        <div className="card">
            <Menubar
                model={getNavbarItemsByRole(userStore.user?.role || Roles.Guest)}
                start={
                    <div className="flex ml-1 mr-2">
                        <img alt="Logo" src="https://img.icons8.com/dotty/480/000000/heart-with-pulse.png" width="40"/>
                    </div>
                }
            />
        </div>
    );
};

export default observer(Navbar);