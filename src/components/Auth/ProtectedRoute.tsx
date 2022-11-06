import {FC} from 'react';
import {Outlet, useLocation} from 'react-router-dom';
import Forbidden403 from '../Errors/Forbidden403';
import Login from '../../pages/Auth/Login';
import userStore from "../../store/user-store";
import {observer} from "mobx-react-lite";

interface ProtectedRouteProps {
    allowedRoles: string[];
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({allowedRoles}) => {
    const location = useLocation();

    if (!userStore.user)
        return <Login redirectTo={location.pathname}/>;

    return (
        allowedRoles.includes(userStore.user?.role) ?
            <Outlet/> :
            <Forbidden403/>
    );
};

export default observer(ProtectedRoute);